if exists('loaded_vimskey')
  finish
endif
let g:loaded_vimskey = 1

command! -nargs=0 VimskeyAuth call denops#request('vimskey', 'getToken', [])
command! -nargs=1 -complete=customlist,VimskeyTimelineTypeCompletion VimskeyOpenTL call denops#request('vimskey', 'openTimeline', ['<args>'])
command! -nargs=0 VimskeyNote call denops#notify('vimskey', 'sendNote', [])
