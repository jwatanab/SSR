/**
 * --------------------------------------------------
 * 掲示板サーバ
 * --------------------------------------------------
 */

/*  データベースに接続  */
const neDB = require('nedb')
const path = require('path')
const db = new neDB({
    filename: path.join(__dirname, 'bbs.db'),
    autoload: true
})

/*  サーバ起動  */
const express = require('express')
const app = express()
const portNo = 30001
app.listen(portNo, () => {
    console.log(`listen localhost:${portNo}`)
})

/*  publicディレクトリ以降は自動的に返す  */
app.use('/public', express.static('./public'))
/*  / -> publicに流す */
app.get('/', (req, res) => {
    res.redirect(302, '/public')
})

/*  API定義  */
/*  ログ取得 */
app.get('/api/getItems', (req, res) => {
    /*  データベースを書き込み時刻でソートして返す  */
    db.find({}).sort({ stime: 1 }).exec((err, data) => {
        if (err) {
            sendJSON(res, false, { logs: [], msg: err })
            return
        }
        console.log(data)
        sendJSON(res, true, { logs: data })
    })
})

/*  新規ログを書き込み  */
app.get('/api/write', (req, res) => {
    const q = req.query
    /*  クエリをDBに書きこむ  */
    db.insert({
        name: q.name,
        body: q.body,
        stime: (new Date()).getTime()
    }, (err, doc) => {
        if (err) {
            console.error(err)
            sendJSON(res, false, { msg: err })
            return
        }
        sendJSON(res, true, { id: doc._id })
    })
})

function sendJSON(res, result, obj) {
    obj['result'] = result
    res.json(obj)
}