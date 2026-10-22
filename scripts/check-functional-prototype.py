# Copyright 2026 Workloom Solutions Private Limited
# SPDX-License-Identifier: MIT
"""Exercise generated prototype controls with a real, network-isolated browser."""
import json
import re
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.route(re.compile(r"^https?://"), lambda route: route.abort())
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    url = Path(sys.argv[1]).resolve().as_uri()
    page.goto(url)
    retry = page.get_by_role("button", name=re.compile(r"retry.*B", re.I)).first
    assert retry.is_enabled(), "Initial pending row cannot be retried"
    initial = page.locator("body").inner_text()
    assert re.search(r"1 of 2", initial, re.I), "Initial completion count is incorrect"
    retry.click()
    finish = page.get_by_role("button", name=re.compile(r"(?:finish|complete).*success", re.I)).first
    if finish.count() and finish.is_visible() and finish.is_enabled():
        finish.click()
    page.wait_for_timeout(2000)
    text = page.locator("body").inner_text()
    assert re.search(r"2 of 2", text, re.I), "Retry did not complete B"
    assert not retry.count() or not retry.is_visible() or retry.is_disabled(), "Completed row can still be retried"
    page.goto(url)
    retry = page.get_by_role("button", name=re.compile(r"retry.*B", re.I)).first
    retry.click()
    page.get_by_role("button", name=re.compile(r"revoke.*permission", re.I)).first.click()
    dialog = page.get_by_role("dialog")
    if dialog.count() and dialog.is_visible():
        dialog.get_by_role("button", name=re.compile(r"^revoke", re.I)).click()
    page.wait_for_timeout(2000)
    assert retry.is_disabled(), "Revocation did not block retry"
    text = page.locator("body").inner_text()
    assert re.search(r"revoked", text, re.I), "No revoked state shown"
    assert not re.search(r"2 of 2", text, re.I), "Retry completed despite revocation"
    assert re.search(r"row A", text, re.I) and re.search(r"completed|preserved|kept", text, re.I), "Completed row disappeared"
    assert not errors, errors
    print(json.dumps({"retry_completed": True, "revocation_blocked_retry": True, "javascript_errors": errors}))
    browser.close()
