# vimskey
Misskey client for Vim/Neovim(WIP)

## Install

予め[Deno](https://deno.land), [denops.vim](https://github.com/vim-denops/denops-vim)がインストールされている必要があります。
Packerの場合

```lua
use({
  'Allianaab2m/vimskey',
  requires = { 'vim-denops/denops.vim' }
})
```

vim-plugの場合
```vim
Plug 'vim-denops/denops.vim'
Plug 'Allianaab2m/vimskey'
```

## Usage

`:VimskeyOpen(Home, Local, Hybrid, Global)Timeline`
タイムラインを表示します。
実行した後，インスタンスURL(https://misskey.ioなど)とAPIトークンを入力してください。

## Todo

- [ ] ノート機能
  - [ ] バッファから
  - [ ] Cmdlineから
- [ ] Renote機能
- [ ] 設定保存機能

