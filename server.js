const express = require('express')
const app = express()
const port = 3030
const bodyParser = require('body-parser')
const multer = require('multer');

app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {

        let fileName = file.originalname;
        let newFileName = '';
        let newArr = [];

        arr = fileName.split('.');

        let imgDetermined = ['GIF', 'PNG', 'JPG', 'JEPG', 'TIFF', 'PSD', 'PDF', 'EPS', 'HEIC', 'RAW', 'AI'];

        if (imgDetermined.find(item => item == arr[arr.length - 1]) != undefined) {
            if (arr[arr.length - 1] != 'JEPG') {
                arr[arr.length - 1] = 'JEPG';
            }
        }
        for (let i = 0; i < arr.length; i++) {
            if (i != arr.length - 1) {
                newFileName += arr[i];
            }
            else {
                newFileName += '-' + Date.now() + '.' + arr[i];
            }
        }
        cb(null, newFileName);
    }
})

var upload = multer({ storage: storage, limits: { fileSize: 1 * 512 * 512 } })

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    else if (file.size > 500000) {
        return res.send('Kich thuoc file qua lon');
    }

    res.send(file);
})

//Uploading multiple files
app.post('/uploadmultiple', upload.array('myFiles', 12), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files)
})

app.post('/upload/photo', upload.array('myImage', 5), (req, res, next) => {
    const files = req.files
    if (!files) {
        const error = new Error('Please choose files')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(files);
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});