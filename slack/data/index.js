// Bring in the room class
const Namespace =  require('../models/NameSpace');
// const Room =  require('../models/Room');

// Set up the namespaces
let namespaces = [];
let wikiNs = new Namespace(0,'Wiki','https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png','/wiki');
let mozNs = new Namespace(1,'Mozilla','https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png','/mozilla');
let linuxNs = new Namespace(2,'Linux','https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png','/linux');

namespaces.push(wikiNs,mozNs,linuxNs);

// Make the main room and add it to rooms. it will ALWAYS be 0
wikiNs.addRoom(0,'New Articles', true);
wikiNs.addRoom(1,'Editors');
wikiNs.addRoom(2,'Other');

mozNs.addRoom(0,'Firefox');
mozNs.addRoom(1,'SeaMonkey');
mozNs.addRoom(2,'SpiderMonkey');
mozNs.addRoom(3,'Rust');

linuxNs.addRoom(0,'Debian');
linuxNs.addRoom(1,'Red Hat');
linuxNs.addRoom(2,'MacOs');
linuxNs.addRoom(3,'Kernal Development');

module.exports = namespaces;