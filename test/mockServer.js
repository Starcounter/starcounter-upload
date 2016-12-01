(function () {
    // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/gi, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "gi"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    var originalWebSocket = WebSocket;
    var mockWebSocket = function (url) {
        var fileName = getParameterByName("FileName", url);
        var fileSize = getParameterByName("FileSize", url) / 1;
        var fileType = getParameterByName("FileType", url);
        var sessionId = getParameterByName("SessionId", url);

        if (!sessionId) {
            throw "Invalid or missing sessionid url parameter"
        }

        if (!fileName && !fileType) {
            throw "Invalid or missing filename and filetype url parameter";
        }

        if (!fileSize) {
            throw "Invalid or missing filesize url parameter";
        }

        this.fileName = fileName;
        this.fileSize = fileSize;
        this.fileType = fileType;
        this.receivedSize = 0;
        this.sessionId = sessionId;
        this.readyState = 1;

        setTimeout(function () {
            this.onopen();
        }.bind(this), 100);
    };

    mockWebSocket.prototype.readyState = 1;
    mockWebSocket.prototype.chunkNumber = 1;
    mockWebSocket.prototype.sendTimeout = 500;

    mockWebSocket.prototype.onopen = function () {
    };

    mockWebSocket.prototype.onclose = function () {
    };

    mockWebSocket.prototype.onmessage = function () {
    };

    mockWebSocket.prototype.onerror = function () {
    };

    mockWebSocket.prototype.send = function (data) {
        var time = this.chunkNumber * this.sendTimeout;

        this.chunkNumber++;

        setTimeout(function () {
            this.receivedSize += data.byteLength;
            this.onmessage({ data: parseInt(this.receivedSize / this.fileSize * 100) });
        }.bind(this), time);
    };

    mockWebSocket.prototype.close = function (code) {
        this.onclose({ code: code });
    };

    window.WebSocket = mockWebSocket;
})();