" ref: https://github.com/ansanloms/denops-misskey/blob/f648207b1ceccadb0234f25991f5fcdefd6d68c8/syntax/misskey-timeline.vim
if exists("b:current_syntax")
  finish
endif

syntax match VimskeyTimelineTagBegin /<mk-[a-z]\+>/ contained conceal
syntax match VimskeyTimelineTagEnd /<\/mk-[a-z]\+>/ contained conceal

highlight! link VimskeyTimelineTagBegin Conceal
highlight! link VimskeyTimelineTagEnd Conceal

syntax region VimskeyTimelineName start="<mk-name>" end="</mk-name>" contains=VimskeyTimelineTagBegin,VimskeyTimelineTagEnd keepend
syntax region VimskeyTimelineUserName start="<mk-username>" end="</mk-username>" contains=VimskeyTimelineTagBegin,VimskeyTimelineTagEnd keepend
syntax region VimskeyTimelineHost start="<mk-host>" end="</mk-host>" contains=VimskeyTimelineTagBegin,VimskeyTimelineTagEnd keepend
syntax match VimskeyTimelineSep "│" contains=VimskeyTimelineTagBegin,VimskeyTimelineTagEnd keepend
syntax match VimskeyTimelineHashtag /\zs#[^ ]\+/

highlight! link VimskeyTimelineName MoreMsg
highlight! link VimskeyTimelineUserName Constant
highlight! link VimskeyTimelineHost LineNr
highlight! link VimskeyTimelineSeparator NonText
highlight! link VimskeyTimelineHashtag Underlined

let b:current_syntax = "vimskey-timeline"
