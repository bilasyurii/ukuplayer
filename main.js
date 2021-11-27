class Song {
  constructor() {
    this.artist = '';
    this.title = '';
    this.link = '';
  }
}

class Marker {
  constructor() {
    this.button = null;
    this.data = null;
  }
}

const UKU = {};

(() => {

const boot = () => {
  setupTitle();
  injectStyles();
  injectScripts();
};

const setupTitle = () => {
  document.title = 'UkuPlayer';
};

const injectStyles = () => {
  injectBootstrap();
  injectMainStyles();
  injectPageStyles();
};

const injectScripts = () => {
  injectJQuery();
  injectBootstrapScript();
  injectPageCode();
};

const injectBootstrap = () => {
  const link = document.createElement('link');
  link.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css';
  link.rel = 'stylesheet';
  link.integrity = 'sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};

const injectMainStyles = () => {
  const link = document.createElement('link');
  link.href = '/main.css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

const injectPageStyles = () => {
  const link = document.createElement('link');
  link.href = './styles.css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

const injectJQuery = () => {
  const script = document.createElement('script');
  script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
  script.async = false;
  document.head.appendChild(script);
};

const injectBootstrapScript = () => {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js';
  script.async = false;
  script.integrity = 'sha384-ka7Sk0Gln4gmtz2MlQnikT1wXgYsOg+OMhuP+IlRH9sENBO0LRn5q+8nbTov4+1p';
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
};

const injectPageCode = () => {
  const script = document.createElement('script');
  script.src = './code.js';
  script.async = false;
  document.head.appendChild(script);
};

const injectVideoJs = () => {
  window.HELP_IMPROVE_VIDEOJS  = false;

  return new Promise((resolve) => {
    const steps = [];

    const addStep = (step) => {
      steps.push(step);
    };

    addStep(injectVideoJsCode);
    addStep(injectVideoJsTheme);
    addStep(injectVideoJsStyles);
    addStep(injectVideoJsYoutubePlugin);
    addStep(injectVideoJsSeekButtonsPluginCode);
    addStep(injectVideoJsSeekButtonsPluginStyles);
    addStep(injectVideoJsMarkersPluginCode);
    addStep(injectVideoJsMarkersPluginStyles);

    let progress = 0;
    const count = steps.length;
    const resolveStep = () => {
      ++progress;
      if (progress === count) {
        resolve();
      }
    };

    for (let i = 0; i < count; ++i) {
      steps[i](resolveStep);
    }
  });
};

UKU.injectVideoJs = injectVideoJs;

const injectVideoJsCode = (cb) => {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/video.js/7.17.0/video.min.js';
  script.integrity = 'sha512-264/2HLR9EPm+2Q6uFPoqzW617BQzd2/UwcXTKIMu3xcpoeAK6NnePpRkVRMsei4mSx+9PA651lTazOft9mGRw==';
  script.crossOrigin = 'anonymous';
  script.referrerPolicy = 'no-referrer';
  script.async = false;
  script.onload = cb;
  document.head.appendChild(script);
};

const injectVideoJsStyles = (cb) => {
  const link = document.createElement('link');
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/video.js/7.17.0/video-js.min.css';
  link.rel = 'stylesheet';
  link.integrity = 'sha512-d4c0djrxPfHtfWvKxxUpyL7jQxHfXf8ijfTcmbK9NZUYpl/Bclwj5SlWDpjxJfq1ah1JAqyFj8T00DmxiX+LJw==';
  link.crossOrigin = 'anonymous';
  link.referrerPolicy = 'no-referrer';
  link.async = false;
  link.onload = cb;
  document.head.prepend(link);
};

const injectVideoJsTheme = (cb) => {
  const link = document.createElement('link');
  link.href = 'https://unpkg.com/@videojs/themes@1/dist/city/index.css';
  link.rel = 'stylesheet';
  link.async = false;
  link.onload = cb;
  document.head.prepend(link);
};

const injectVideoJsYoutubePlugin = (cb) => {
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/videojs-youtube/2.6.1/Youtube.min.js';
  script.integrity = 'sha512-mF+XuiEvJq707N/B9Fm/fI2wgMcWuFLsoztIp0UzEKgHCZgczbYpO2+Vq2TEi0LmE4crVj2r8AYru7X5QjVotw==';
  script.crossOrigin = 'anonymous';
  script.referrerPolicy = 'no-referrer';
  script.async = false;
  script.onload = cb;
  document.head.appendChild(script);
};

const injectVideoJsSeekButtonsPluginCode = (cb) => {
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/videojs-seek-buttons/dist/videojs-seek-buttons.min.js';
  script.async = false;
  script.onload = cb;
  document.head.appendChild(script);
};

const injectVideoJsSeekButtonsPluginStyles = (cb) => {
  const link = document.createElement('link');
  link.href = 'https://cdn.jsdelivr.net/npm/videojs-seek-buttons/dist/videojs-seek-buttons.css';
  link.rel = 'stylesheet';
  link.async = false;
  link.onload = cb;
  document.head.prepend(link);
};

const injectVideoJsMarkersPluginCode = (cb) => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/videojs-markers-plugin@1.0.2/dist/videojs-markers-plugin.min.js';
  script.crossOrigin = 'anonymous';
  script.referrerPolicy = 'no-referrer';
  script.async = false;
  script.onload = cb;
  document.head.appendChild(script);
};

const injectVideoJsMarkersPluginStyles = (cb) => {
  const link = document.createElement('link');
  link.href = 'https://unpkg.com/videojs-markers-plugin@1.0.2/dist/videojs.markers.plugin.min.css';
  link.rel = 'stylesheet';
  link.async = false;
  link.onload = cb;
  document.head.prepend(link);
};

boot();

})();

UKU.inputVal = (name) => {
  return $(`input[name="${name}"]`).val()
};
