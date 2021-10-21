require("./bootstrap");

Echo.channel("public-channel").listen("MessageEvent", (e) => {
    console.log(e);
});
console.log("hello");
