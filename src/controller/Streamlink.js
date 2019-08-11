const { spawn, exec } = require('child_process');
const EventEmitter = require('events').EventEmitter;
const fs = require('fs-extra');
const kill = require('tree-kill');

class Streamlink extends EventEmitter {
    constructor(stream) {
        super();
        this.stream = stream;
    }

    output(loc) {
        this.outputLoc = loc;
        return this;
    }

    quality(qual) {
        this.qual = qual;
        return this;
    }

    isLive(done) {
        exec('streamlink -j ' + this.stream, (err, stdout, stderr) => {
            var json = JSON.parse(stdout);
            if (json.error);
            else {
                this.qualities = Object.keys(json['streams']);
                done(true);
            }
        });
    }

    start(done,extraArgs) {
        if (this.outputLoc && fs.existsSync(this.outputLoc)) {
            this.emit('err', 'File already exists.');
            return this;
        }
        this.isLive(live => {
            if (!live) {
                this.emit('err', 'Is not live.');
                return;
            }
            var args = [];
            if (this.outputLoc) {
                args.push('-o');
                args.push(this.outputLoc);
            }
            extraArgs.map(function (exArg){args.push(exArg)});
            args.push(this.stream);
            args.push(this.qual || 'best');
            this.startTime = Math.floor(Date.now() / 1000);

            console.log(args)
            this.live = spawn('streamlink', args,{shell:true});
            this.live.stdout.on('data', (d) => {                
                //console.log(`stdout: ${d}`);
            });
            this.live.stderr.on('data', (data) => {
                console.log(`stderr: ${data}`);
              });
            this.live.on('close', (code, st) => this.end(code, st));
        });
        return this;
    }

    live() {
        return this;
    }

    end(code, st) {
        console.log(code, st);
        var endO = {
            exitCode: code,
            duration: Math.floor(Date.now() / 1000) - this.startTime,
            output: this.outputLoc,
            startTime: this.startTime,
            stream: this.stream
        };
        this.emit('end', endO);
        if (this.live) kill(this.live.pid);
        return endO;
    }

    getQualities() {
        this.isLive(live => {
            this.emit('quality', this.qualities);
            return this;
        });
        this.emit('err', 'Stream is not live.');
    }
}

module.exports = Streamlink;