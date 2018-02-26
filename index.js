const fs = require('fs')
const humanTime = require('human-time')

const intval = 1007
const folderOrfile = process.argv[2]
let exists = false

if (!folderOrfile) {
    console.error('supply a file or folder')
    process.exit(1)
}

const created_date = ({ birthtime }) =>
    !exists && (Date.now() - birthtime) < intval
const nothere = ({ birthtime, mtime, atime, ctime }) =>
    !(birthtime | mtime | atime | ctime)
const updated = (cur, prv) => cur.mtime !== prv.mtime

fs.watchFile(folderOrfile, { intval }, (cur, prv) => {
    if (nothere(cur)) {
        const msg = exists ? 'deleted' : 'is not here'
        exists = false
        return console.log(`${folderOrfile} ${msg}`)
    }
    if (created_date(cur)) {
        exists = true
        return console.log(`${folderOrfile} just created ${humanTime((cur.birthtime))}`)
    }
    exists = true
    if (updated(cur, prv)) {
        return console.log(`${folderOrfile} just updated ${humanTime((cur.mtime))}`)
    }

    console.log(`${folderOrfile} just modified ${humanTime((cur.mtime))}`)
})