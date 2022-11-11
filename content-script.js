const timelineWrapperSelector = '[aria-label="Timeline: Your Home Timeline"]';
const singleTweetWrapperSelector = '[data-testid="tweetText"]';

const checkIfTimelineDOMExists = () =>
  new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      const elem = document.querySelector(timelineWrapperSelector);

      if (elem) {
        clearInterval(interval);
        return resolve();
      }
    }, 1000);
  });

const getEmotion = ({ tweet, elem }) => {
  try {
    // Replace with your API!
    fetch(`https://YOUR-API?tweet=${tweet}`)
      .then((res) => res.json())
      .then((res) => {
        const emotion = res.data.choices[0].text.replace(" ", "");

        let bgColor = "";
        if (emotion === "Negative") {
          bgColor = "rgb(59 130 246)";
        } else if (emotion === "Positive") {
          bgColor = "rgb(249 115 22)";
        } else {
          bgColor = "rgb(148 163 184)";
        }

        const parent = elem.closest('[data-testid="cellInnerDiv"]');

        parent.style.backgroundColor = bgColor;
      });
  } catch (err) {
    console.log(err.message);
  }
};

const observer = new MutationObserver((mutationList) => {
  mutationList.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      const singleTweetWrapper = node.querySelector(singleTweetWrapperSelector);
      if (!singleTweetWrapper) return;

      const tweet = singleTweetWrapper.textContent;
      if (!tweet) return;

      getEmotion({ tweet, elem: node });
    });
  });
});

checkIfTimelineDOMExists().then((res) => {
  const timelineWrapper = document.querySelector(timelineWrapperSelector);
  const tweetList = timelineWrapper.firstElementChild;

  observer.observe(tweetList, { subtree: false, childList: true });

  for (const elem of document.querySelectorAll(singleTweetWrapperSelector)) {
    const tweet = elem.textContent;
    if (!tweet) return;
    getEmotion({ tweet, elem });
  }
});
