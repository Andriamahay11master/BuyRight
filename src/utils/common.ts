//function scrolltotop
export function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

//function scrolltoend of the page
export function scrollToBottom() {
    window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
    });
}