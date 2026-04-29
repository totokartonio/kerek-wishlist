let lockCount = 0;
let scrollY = 0;

export const lockScroll = () => {
  lockCount++;
  if (lockCount === 1) {
    scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  }
};

export const unlockScroll = () => {
  lockCount--;
  if (lockCount <= 0) {
    lockCount = 0;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollY);
  }
};
