const express = require('express');
const app = express();
const cors = require('cors');

//URLs can access
let corsOptions = {

	origin: ['https://app.test.com', 'http://app.test.com',
		'https://www.app.test.com', 'http://www.app.test.com',
		'http://localhost:1478', 'http://localhost:3000'
	]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes')(app)

app.get('/', (req, res) => {

    res.json({
        message: 'HELLO, Welcome to exhibitation application.',
        dateTime: Date.now()

    });
});

// set port, listen for requests
const PORT = 9990;
app.listen(PORT, () => {
    console.log("server listening in port 9990")
});

