# Copyright 2026 Workloom Solutions Private Limited
# SPDX-License-Identifier: MIT
"""Run unmodified upstream scanners against synthetic HTTP responses, offline.

This is test transport, never live provider evidence. Unknown URLs fail closed.
"""
import io
import json
import os
import runpy
import sys
import time
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from pathlib import Path

now = datetime.now(timezone.utc).isoformat()
title = "How do you resume a CSV import without duplicating completed rows?"
body = "Synthetic test discussion. Row A completed and B failed. I track row IDs before retrying B. How do you handle revoked import permissions?"

class Response(io.BytesIO):
    status = 200
    headers = {'Content-Type':'application/atom+xml; charset=utf-8'}

    def geturl(self):
        return 'https://www.reddit.com/r/programming/new/.rss'

def fixture_response(request, **kwargs):
    url = request.full_url if hasattr(request, 'full_url') else str(request)
    if url.startswith('https://hn.algolia.com/api/v1/search'):
        data = {'hits':[{'objectID':'999999999','title':title,'story_text':body,'points':20,'num_comments':2,'author':'synthetic_fixture','created_at':now,'created_at_i':int(time.time())-1800,'_tags':['ask_hn']}],'nbHits':1,'nbPages':1}
        query = urllib.parse.parse_qs(urllib.parse.urlparse(url).query).get('query',[''])[0]
        if 'Cedar Tasks' in query or 'QueuePad' in query:
            data['hits'][0]['title'] = 'Synthetic comparison: Cedar Tasks and QueuePad imports'
    elif url.startswith('https://hn.algolia.com/api/v1/items/'):
        data = {'id':999999999,'title':title,'text':body,'children':[{'text':'Synthetic reply: keep a durable completed-row checkpoint and check permission before every retry.','children':[]}]}
    elif urllib.parse.urlparse(url).hostname in ('www.reddit.com','old.reddit.com'):
        feed_title = 'Synthetic comparison: Cedar Tasks and QueuePad imports' if 'search.rss' in url else title
        return Response(('<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom"><entry><id>t3_synthetic_fixture</id><title>'+feed_title+'</title><link href="https://www.reddit.com/r/programming/comments/synthetic_fixture/"/><author><name>synthetic_fixture</name></author><published>'+now+'</published><content>'+body+'</content></entry></feed>').encode())
    elif url == 'https://api.producthunt.com/v2/api/graphql':
        variables = json.loads(request.data)['variables']
        if 'id' in variables:
            data = {'data':{'post':{'votes':{'edges':[]},'comments':{'edges':[{'node':{'body':body,'user':None}}]}}}}
        else:
            node={'id':'999999999','name':'Synthetic Import Checkpoint','tagline':'CSV import recovery with completed-row checkpoints','description':body,'url':'https://www.producthunt.com/posts/synthetic-import-checkpoint','website':None,'votesCount':10,'commentsCount':1,'createdAt':now,'topics':{'edges':[{'node':{'name':'Developer Tools'}}]},'makers':[]}
            data={'data':{'posts':{'edges':[{'node':node}],'pageInfo':{'hasNextPage':False,'endCursor':None}}}}
    else:
        raise RuntimeError('Synthetic transport refused an undeclared URL: '+url)
    return Response(json.dumps(data).encode())

script = Path(sys.argv[1]).resolve()
if script.name not in ('buzz-scan.py','buzz-ph-scan.py'):
    raise SystemExit('Only upstream scanners are supported')
os.environ['PH_API_TOKEN'] = 'SYNTHETIC_TEST_TOKEN_NEVER_SENT'
urllib.request.urlopen = fixture_response
sys.path.insert(0,str(script.parent))
sys.argv = [str(script),*sys.argv[2:]]
print('SYNTHETIC HTTP TRANSPORT: no live provider calls or credentials used')
runpy.run_path(str(script),run_name='__main__')
