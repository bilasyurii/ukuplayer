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

boot();

})();

const UKU = {};

UKU.inputVal = (name) => {
  return $(`input[name="${name}"]`).val()
};
