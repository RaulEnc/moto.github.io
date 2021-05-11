
var legalLinks = [
    {locale:'en_US', url:'https://www.motorola.com/us/legal/motorola-legal-and-privacy-policy'},
    {locale:'en_CA', url:'https://www.motorola.com/us/legal/privacy-policy'},
    {locale:'fr_CA', url:'https://www.motorola.com/us/legal/privacy-policy'},
    {locale:'pt_BR', url:'https://www.motorola.com.br/legal/privacy-policy'},
    {locale:'es_VOID', url:'http://latam.motorola.com/consumers/About_Motorola-Legal-Privacy_Policy/About_Motorola-Legal-Privacy_Policy,es_latam,pg.html'},
    {locale:'es_MX', url:'https://www.motorola.com.mx/legal/privacy-policy'},
    {locale:'es_AR', url:'http://www.motorola.com.ar/legal/privacy-policy'},
    {locale:'en_GB', url:'https://www.motorola.co.uk/legal/privacy-policy'},
    {locale:'fr_FR', url:'https://www.motorola.fr/legal/privacy-policy'},
    {locale:'de_DE', url:'https://www.motorola.de/legal/terms-of-use'},
    {locale:'en_AU', url:'https://www.motorola.co.uk/legal/privacy-policy'},
    {locale:'zh_CN', url:'http://www.motorola.com.cn/legal/privacy-policy'},
    {locale:'ja_JP', url:'http://www.motorola.co.jp/legal/privacy-policy'},
];

    var homepageLinks = [
           {locale:'en_US', url:'http://www.motorola.com'},
           {locale:'en_CA', url:'http://www.motorola.ca'},
           {locale:'fr_CA', url:'http://fr.motorola.ca'},
           {locale:'pt_BR', url:'http://www.motorola.com.br'},
           {locale:'es_VOID', url:'http://latam.motorola.com'},
           {locale:'es_MX', url:'http://www.motorola.com.mx'},
           {locale:'es_AR', url:'http://www.motorola.com.ar'},
           {locale:'en_GB', url:'http://www.motorola.co.uk'},
           {locale:'fr_FR', url:'http://www.motorola.fr'},
           {locale:'de_DE', url:'http://www.motorola.de'},
           {locale:'en_AU', url:'http://www.motorola.com.au'},
           {locale:'zh_CN', url:'http://www.motorola.com.cn'},
           {locale:'ja_JP', url:'http://www.motorola.co.jp'},
     ];

function parseLocale(locale) {
    var localeParts = locale.split(/[^a-zA-Z0-9]+/);
    if (localeParts.length < 2) {
        localeParts.push('');
    }
    localeParts[0] = localeParts[0].toLowerCase();
    localeParts[1] = localeParts[1].toUpperCase();
    return localeParts;
}

function getPageLink(locale, linkArray) {
    // First look for an exact locale match.
    for (var i=0; i < linkArray.length; ++i) {
        if (linkArray[i].locale == locale) {
            return linkArray[i].url;
        }
    }

    var localeParts = parseLocale(locale);

    // If no locale exactly matches, then look for a match on the
    // country. The first match wins.
    for (var i=0; i < linkArray.length; ++i) {
        var currCountry = parseLocale(linkArray[i].locale)[1];
        if (currCountry == localeParts[1]) {
            return linkArray[i].url;
        }
    }

    // If there was still no match, then look for a match on the
    // language. The first match wins.
    for (var i=0; i < linkArray.length; ++i) {
        var currLanguage = parseLocale(linkArray[i].locale)[0];
        if (currLanguage == localeParts[0]) {
            return linkArray[i].url;
        }
    }

    // If there was no match at all, then return the first in the list.
    return linkArray[0].url;
}

function openLegalLink() {
    window.open(getPageLink(gObject.langString, legalLinks));
}

function openHomepageLink() {
    window.open(getPageLink(gObject.langString, homepageLinks));
}

// Get the value of a single window.location.search key.
// Reference implementation gotten from
// "https://developer.mozilla.org/en-US/docs/Web/API/Window.location"
function loadPageVar (sVar) {
    return decodeURI(window.location.search.replace(new RegExp(
        "^(?:.*[&\\?]" + encodeURI(sVar).replace(/[\.\+\*]/g, "\\$&") +
        "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

var APP_URL_PARAM = 'TARGET';
if(!loadPageVar('TARGET') && loadPageVar('svc')) {
    APP_URL_PARAM = 'svc';
}

