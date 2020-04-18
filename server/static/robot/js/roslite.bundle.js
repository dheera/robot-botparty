(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.ros = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
class ROSLiteCore {
  constructor() {
    this.topics = {};
    this.nodes = {};
  }

  _registerNode(node) {
    this.nodes[node.nodeName] = node;
  }

  _publish(nodeName, topicName, msg) {
    if(!("@type" in msg)) {
      console.error("error: message contains no @type", msg);
      return;
    }

    if(!(topicName in this.topics)) {
      this.topics[topicName] = {
        topicType: msg["@type"],
        subscriberNodes: [],
      };
    }

    if(this.topics[topicName].topicType !== msg["@type"]) {
      console.error("error: topic " + topicName + " is of type " + this.topics[topicName].topicType + 
        " but a message of type " + msg["@type"] + " was published to it");
      return;
    }

    this.topics[topicName].subscriberNodes.forEach(subscriberNode => {
      subscriberNode._notify(topicName, msg);
    });
  }

  _subscribe(node, topicName, topicType) {
    if(!(topicName in this.topics)) {
      this.topics[topicName] = {
        topicType: topicType,
        subscriberNodes: [],
      };
    }
    this.topics[topicName].subscriberNodes.push(node);
  }
};

module.exports = ROSLiteCore;


},{}],2:[function(require,module,exports){
const ROSLiteSubscriber = require("./ROSLiteSubscriber.js");
const ROSLitePublisher = require("./ROSLitePublisher.js");

class ROSLiteNode {
  constructor(core, nodeName) {
    this.core = core;
    this.nodeName = nodeName;
    this.subscribers = {};
    this.core._registerNode(this);
  }

  advertise(topicName, topicType) {
    return new ROSLitePublisher(this, topicName, topicType);
  }

  subscribe(topicName, topicType, callback) {
    this.subscribers[topicName] = new ROSLiteSubscriber(this, topicName, topicType, callback);
    this.core._subscribe(this, topicName, topicType);
    return this.subscribers[topicName];
  }

  _notify(topicName, msg) {
    if(!("@type" in msg)) {
      console.error("error: message contains no @type", msg);
      return;
    }

    this.subscribers[topicName]._notify(msg);
  }

  _publish(topicName, msg) {
    if(!("@type" in msg)) {
      console.error("error: message contains no @type", msg);
    }

    this.core._publish(this, topicName, msg);
  }
}

module.exports = ROSLiteNode;

},{"./ROSLitePublisher.js":3,"./ROSLiteSubscriber.js":4}],3:[function(require,module,exports){
class ROSLitePublisher {
  constructor(node, topicName, topicType) {
    this.node = node;
    this.topicName = topicName;
    this.topicType = topicType;
  }

  publish(msg) {
    if(!("@type" in msg)) {
      console.error("error: message contains no @type", msg);
      return;
    }

    this.node._publish(this.topicName, msg);
  }
}

module.exports = ROSLitePublisher;

},{}],4:[function(require,module,exports){
class ROSLiteSubscriber {
  constructor(node, topicName, topicType, callback) {
    this.node = node;
    this.topicName = topicName;
    this.topicType = topicType;
    this.callback = callback;
  }

  _notify(msg) {
    if(!("@type" in msg)) {
      console.error("error: message contains no @type", msg);
      return;
    }

    this.callback(msg);
  }
}

module.exports = ROSLiteSubscriber;

},{}],5:[function(require,module,exports){
const ROSLiteCore = require("./ROSLiteCore.js");
const ROSLiteNode = require("./ROSLiteNode.js");

let _core = new ROSLiteCore();
let initNode = (nodeName) => {
  return new ROSLiteNode(_core, nodeName);
}

module.exports = {
  initNode: initNode,
}

},{"./ROSLiteCore.js":1,"./ROSLiteNode.js":2}]},{},[5])(5)
});
