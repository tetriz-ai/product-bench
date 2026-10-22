// Copyright 2026 Workloom Solutions Private Limited
// SPDX-License-Identifier: MIT
// JSON and JSONL can represent the same staged run; validate each representation
// independently so copies do not masquerade as duplicate observations.
export function validCitationRepresentation(rows) {
  const observations = rows.map(row => row.observation || row);
  return observations.length === 1 && observations.every(row =>
    row.prompt_id === 'ACP-001' && String(row.prompt_version) === '1' &&
    row.first_party_cited === true && row.brand_mentioned === true &&
    row.accuracy_status === 'accurate');
}

export function validSignalBank(rows) {
  const ids = rows.map(row => row.native_id || row.source_id || row.signal_id || row.id);
  return rows.length === 2 && ids.filter(id => id === 's1').length === 1 &&
    ids.filter(id => id === 's2').length === 1;
}

export function buzzExecution(transcript, mode) {
  const calls=new Map(), executions=[];
  for(const line of transcript.split('\n').filter(Boolean)) {
    const event=JSON.parse(line);
    if(event.type==='item.completed'&&event.item?.type==='command_execution')executions.push({command:event.item.command,success:event.item.exit_code===0,output:event.item.aggregated_output||''});
    for(const block of event.message?.content||[]) {
      if(block.type==='tool_use')calls.set(block.id,block);
      if(block.type==='tool_result'&&calls.get(block.tool_use_id)?.name==='Bash') {
        const content=typeof block.content==='string'?block.content:JSON.stringify(block.content);
        executions.push({command:calls.get(block.tool_use_id).input.command,success:!block.is_error,output:[content,event.tool_use_result?.stdout,event.tool_use_result?.stderr].filter(Boolean).join('\n')});
      }
    }
  }
  const selected=mode==='daily'?['ph','hn','reddit']:mode==='init'?['hn']:[mode];
  const scoped=executions.flatMap(execution=> {
    const lines=execution.output.split('\n'),records=[];
    for(let index=0;index<lines.length;index++)try {
      const record=JSON.parse(lines[index]);
      if(Array.isArray(record.argv)&&typeof record.exit_code==='number')records.push({index,record});
    }catch{}
    if(!records.length) {
      if(!/buzz-(?:ph-)?scan\.py/.test(execution.command))return [execution];
      const markers=[];
      for(let index=0;index<lines.length;index++) {
        const match=lines[index].match(/^(?:(ph|hn|reddit)\s+(-?\d+)\s+)?(?:SYNTHETIC HTTP TRANSPORT:|Scanning (Hacker News|Reddit|Product Hunt)|Brand monitor:)/);
        if(match&&match[1])markers.push({index,lane:match[1],success:execution.success&&Number(match[2])===0});
        else if(match&&match[3]&&!markers.some(marker=>marker.index===index-1))markers.push({index:lines[index-1]?.startsWith('SYNTHETIC HTTP TRANSPORT:')?index-1:index,lane:{'Hacker News':'hn','Reddit':'reddit','Product Hunt':'ph'}[match[3]],success:execution.success});
        else if(match&&lines[index].startsWith('Brand monitor:'))markers.push({index:lines[index-1]?.startsWith('SYNTHETIC HTTP TRANSPORT:')?index-1:index,lane:'brands',success:execution.success});
      }
      if(!markers.length)return [execution];
      return markers.map((marker,i)=>({...execution,...marker,output:lines.slice(marker.index,markers[i+1]?.index||lines.length).join('\n')}));
    }
    return records.map(({index,record},i)=>({command:record.argv.join(' '),success:execution.success&&record.exit_code===0,output:lines.slice(index+1,records[i+1]?.index||lines.length).join('\n')}));
  });
  const laneResults=selected.map(lane=> {
    const matched=scoped.filter(e=>e.lane?e.lane===lane:lane==='ph'?/buzz-ph-scan\.py/.test(e.command):/buzz-scan\.py/.test(e.command)&&new RegExp(`--${lane==='brands'?'mode':'platform'}['"]?[\\s,=]+['"]?${lane}\\b`).test(e.command));
    const successful=matched.findLast(e=>e.success&&/Scanning (?:Hacker News|Reddit|Product Hunt)|Brand monitor:/.test(e.output));
    if(!successful)return {lane,status:matched.some(e=>/Missing Product Hunt API token/i.test(e.output))?'missing-token':'not-executed'};
    const feeds=successful.output.match(/reddit feeds:\s*(\d+)\/(\d+)/);
    if(/\[[^\]]+\][^\n]*(?:failed|rss failed)/i.test(successful.output)||(feeds&&Number(feeds[1])<Number(feeds[2])))return {lane,status:'fetch-failed'};
    return {lane,status:/SYNTHETIC HTTP TRANSPORT/.test(successful.output)?'synthetic':/0 fresh (?:PH )?candidates/.test(successful.output)?'empty':'executed'};
  });
  return {lanes:laneResults,positive_execution:laneResults.some(r=>['missing-token','not-executed','fetch-failed'].includes(r.status))?'unverified':laneResults.every(r=>r.status==='synthetic')?'tested-synthetic-dry-run':laneResults.every(r=>r.status==='empty')?'tested-empty-scan':'tested-dry-run'};
}

export function humanizerEvidence(transcript,host) {
  const calls=new Map();let completed=0;
  for(const line of transcript.split('\n').filter(Boolean)) {
    const event=JSON.parse(line);
    if(host==='codex'&&event.type==='item.completed'&&event.item?.type==='collab_tool_call'&&event.item.tool==='wait'&&event.item.status==='completed')completed++;
    for(const block of event.message?.content||[]) {
      if(block.type==='tool_use'&&block.name==='Agent'&&/humanizer/i.test(block.input?.subagent_type||''))calls.set(block.id,block);
      if(block.type==='tool_result'&&!block.is_error&&calls.has(block.tool_use_id))completed++;
    }
  }
  return {protocol:host==='claude'?'successful-native-humanizer-Agent':'completed-native-collaboration-wait',completed};
}
