let _toast = null
let _toastTimer = null

export function showToast(msg, duration = 1500) {
  if (_toast) {
    clearTimeout(_toastTimer)
    _toast.remove()
  }
  const el = document.createElement('div')
  el.style.cssText = `
    position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
    background:rgba(0,0,0,.75);color:#fff;padding:12px 24px;border-radius:8px;
    font-size:14px;z-index:99999;pointer-events:none;opacity:0;transition:opacity .2s;
    max-width:80vw;text-align:center;
  `
  el.textContent = msg
  document.body.appendChild(el)
  _toast = el
  requestAnimationFrame(() => { el.style.opacity = '1' })
  _toastTimer = setTimeout(() => {
    el.style.opacity = '0'
    setTimeout(() => el.remove(), 200)
    _toast = null
  }, duration)
}

export function showModal(title, content) {
  return new Promise(resolve => {
    const mask = document.createElement('div')
    mask.style.cssText = `
      position:fixed;top:0;left:0;right:0;bottom:0;
      background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:99999;
    `
    mask.innerHTML = `
      <div style="background:#fff;border-radius:12px;padding:20px;width:280px;text-align:center;">
        <h3 style="font-size:17px;margin:0 0 8px;">${title}</h3>
        <p style="font-size:14px;color:#666;margin:0 0 16px;">${content}</p>
        <div style="display:flex;gap:10px;">
          <button class="modal-cancel" style="flex:1;padding:10px;border:none;background:#f5f5f5;border-radius:8px;font-size:14px;cursor:pointer;">取消</button>
          <button class="modal-confirm" style="flex:1;padding:10px;border:none;background:#ff6b35;color:#fff;border-radius:8px;font-size:14px;cursor:pointer;">确定</button>
        </div>
      </div>
    `
    document.body.appendChild(mask)
    mask.querySelector('.modal-cancel').onclick = () => { mask.remove(); resolve({ confirm: false, cancel: true }) }
    mask.querySelector('.modal-confirm').onclick = () => { mask.remove(); resolve({ confirm: true, cancel: false }) }
  })
}
