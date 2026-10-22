// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { validCitationRepresentation, validSignalBank, buzzExecution, humanizerEvidence } from './functional-artifacts.mjs';

// Reusable against retained artifacts. Regrading never reruns a host or edits its outputs.
export function checkFunctionalArtifacts({host,scenario,target,folder,repo,evidence,artifact,transcript,local}) {
  const failures=[];
      if(!artifact.trim())failures.push('Empty artifact');
      const outputs=join(target,'team/brain/outputs');
      let files=[];try{files=readdirSync(outputs,{recursive:true}).filter(file=>/\.(md|json|jsonl|html|pdf|png|csv|txt)$/.test(file));}catch{}
      const rowsIn=(file)=>{try{const text=readFileSync(join(outputs,file),'utf8');if(file.endsWith('.jsonl'))return text.trim().split('\n').map(JSON.parse);const value=JSON.parse(text);return Array.isArray(value)?value:value.observations||value.signals||value.records||value.rows||[];}catch{return[];}};
      if(scenario.expected==='citation-record') {const staged=files.filter(f=>/(?:^|\/)observations\.jsonl?$/.test(f));if(!staged.length||!staged.every(file=>validCitationRepresentation(rowsIn(file))))failures.push('Exactly one validated citation observation was not staged');}
      if(scenario.expected==='signal-bank') {const banks=files.filter(f=>/bank.*\.jsonl?$/.test(f));if(!banks.length||!banks.every(file=>validSignalBank(rowsIn(file))))failures.push('Deduplicated structured signal bank missing');}
      if(scenario.expected==='editorial'&&!files.some(file=>/review|editorial|polish/.test(file))&&!/^## .*editorial review/im.test(artifact))failures.push('No saved editorial review');
      if(scenario.expected==='prototype')try{const proof=execFileSync(process.env.PB_RENDERER_PYTHON||'python3',[join(repo,'scripts/check-functional-prototype.py'),join(outputs,'prototype.html')],{encoding:'utf8',timeout:30000});writeFileSync(join(folder,'browser-check.json'),proof);}catch(error){failures.push(`Prototype browser interactions failed: ${error.stderr?.toString()||error.message}`);}
      if(scenario.expected==='document')try{const html=readFileSync(join(outputs,'artifact.html'),'utf8');const pdf=readFileSync(join(outputs,'artifact.pdf'));if(!/#5D3FD3/i.test(html))failures.push('Approved brand accent missing');if(pdf.subarray(0,5).toString()!=='%PDF-')failures.push('Invalid PDF');const pages=Number(execFileSync(process.env.PB_RENDERER_PYTHON||'python3',['-c','import sys;from pypdf import PdfReader;print(len(PdfReader(sys.argv[1]).pages))',join(outputs,'artifact.pdf')],{encoding:'utf8'}).trim());if(pages<1)failures.push('PDF has no actual pages');}catch{failures.push('Actual branded HTML/PDF missing or unparsable');}
      if(scenario.expected==='analytics-save')try{const saved=JSON.parse(readFileSync(join(target,'team/brain/analytics/saved/activation.json'),'utf8'));if(saved.metric!=='activation_rate'||saved.provider!=='fixture')failures.push('Saved analytics definition incorrect');}catch{failures.push('Saved analytics definition missing');}
      if(scenario.allowedContext)try{if(!/100/.test(readFileSync(join(target,'team/brain/context/product.md'),'utf8')))failures.push('Approved context update missing');}catch{failures.push('Context file missing');}
      if(scenario.expected==='setup-context') {
        for(const [file,facts] of Object.entries(scenario.setupContext))try{const context=readFileSync(join(target,'team/brain/context',file),'utf8');if(!context.includes(facts))failures.push(`Approved setup facts missing in ${file}`);}catch{failures.push(`Setup context missing: ${file}`);}
        try{const registry=JSON.parse(readFileSync(join(target,'team/brain/sources.json'),'utf8'));if(!registry.sources.some(source=>source.id==='setup-evidence'))failures.push('Approved setup source was not registered');}catch{failures.push('Setup sources missing');}
        if(!/product-bench\.mjs[^\n]*analytics/.test(evidence))failures.push('Setup fixture analytics did not execute');
        if(!files.filter(file=>file.endsWith('.md')&&file!=='artifact.md').some(file=>{const text=readFileSync(join(outputs,file),'utf8');return /^# .*spec/im.test(text)&&(text.match(/^##\s+\d+[.)]?\s+/gm)||[]).length===8;}))failures.push('Setup did not start and save the selected first spec');
      }
      if(scenario.expected==='sync')try{const status=JSON.parse(local('sync-status'));const state=status.sources.find(s=>s.id==='notes')?.state;if(status.proposals.length||!state?.reviewed_cursor||state.reviewed_cursor!==state.observed_cursor||!/sync-decide[^\n]*accepted[^\n]*applied/.test(evidence))failures.push('Applied proposal/checkpoint not verified');}catch(error){failures.push(error.message);}
      if(scenario.expected==='review') {
        const executions=[];for(const file of files.filter(file=>file.endsWith('execution.json')))try{executions.push(JSON.parse(readFileSync(join(outputs,file),'utf8')));}catch{}
        const receipts=executions.flatMap(execution=>execution.reviews||[]);
        const required=['customer','devil','functional','scope-altitude','platform-data','measurement','engineering','engineering-handoff','naive-reader','consistency','regression','legal-privacy'];
        if(required.some(lens=>!receipts.some(r=>r.lens===lens&&r.exit_code===0&&r.fresh_process&&r.host===host)))failures.push('Required real independent lens receipts incomplete');
        if(!/review-lenses\.mjs/.test(evidence||''))failures.push('No successful native reviewer adapter execution');
        if(executions.some(execution=>execution.concurrency!==scenario.parallel))failures.push('Reviewer concurrency does not match selected mode');
        if(new Set(receipts.map(r=>r.pid)).size!==receipts.length)failures.push('Reviewer processes were reused');
        if(receipts.some(r=>r.lens==='naive-reader'&&r.sources?.length))failures.push('Cold reader received supporting context');
      }
      if(scenario.expected==='buzz') {
        if(scenario.mode==='init')try{const config=readFileSync(join(target,'buzz/config.yaml'),'utf8');if(/FILL_IN_PRODUCT|FILL_IN_DOMAIN|FILL_IN_PILLAR/.test(config))failures.push('Buzz init left required product placeholders');}catch{failures.push('Buzz project config missing');}
        else {const run=buzzExecution(transcript,scenario.mode);if(run.lanes.some(lane=>lane.status==='not-executed'))failures.push('Selected upstream scanner did not execute');}
        if(/buzz-slack-upload\.py/.test(evidence))failures.push('Dry run attempted delivery');
        if(scenario.buzzFixture&&!['init','brands'].includes(scenario.mode)) {
          const work=join(target,'buzz/working');let workFiles=[];try{workFiles=readdirSync(work).map(file=>join(work,file));}catch{}
          const paths=[...files.map(file=>join(outputs,file)),...workFiles];
          const drafted=paths.some(file=> {
            if(file.endsWith('.json'))try{const value=JSON.parse(readFileSync(file,'utf8'));return (value.judged||[]).some(row=>typeof row.comment_draft==='string'&&row.comment_draft.trim().length>20);}catch{return false;}
            if(file.endsWith('.md')){const text=readFileSync(file,'utf8');return /draft|comment card/i.test(text)&&/^> .{20,}/m.test(text);}
            return false;
          });
          if(!drafted)failures.push('Synthetic candidate did not produce a saved draft');
          if(['reddit','ph','daily'].includes(scenario.mode)&&!humanizerEvidence(transcript,host).completed)failures.push('Required native humanizer execution evidence missing');
          if(scenario.mode==='daily') {
            const pdfs=paths.filter(file=>file.endsWith('.pdf'));
            if(!pdfs.length)failures.push('Synthetic daily digest PDF missing');
            for(const file of pdfs)try{const pages=Number(execFileSync(process.env.PB_RENDERER_PYTHON||'python3',['-c','import sys;from pypdf import PdfReader;print(len(PdfReader(sys.argv[1]).pages))',file],{encoding:'utf8'}).trim());if(pages<1)failures.push('Synthetic daily digest PDF has no pages');}catch{failures.push('Synthetic daily digest PDF is invalid');}
          }
        }
      }
  return failures;
}
