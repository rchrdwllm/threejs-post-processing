import { SmoothScroll } from "../util/native-smooth-scroll";
import imagesLoaded from "imagesloaded";

const scroll = new SmoothScroll({
    container: document.querySelector(".smooth-scroll"),
    threshold: 1,
    useRaf: true,
});
const imgs = document.querySelectorAll("img");

let scrollEvent = scroll.scroll;

imagesLoaded(imgs, () => scroll.update());

scroll.onScroll((e) => {
    scrollEvent = e;
});

module.exports = {
    scrollEvent,
};
