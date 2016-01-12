var app   = require('express')();
var faker = require('faker');

function createUser() {
	return {
		id : faker.random.uuid() ,
		nombre : faker.name.findName() ,
		contenido : faker.hacker.phrase() ,
		fecha : (faker.date.recent()).toISOString() ,
		imagen : faker.image.people()
	}
}

app.get('/posts' , function ( req , res ) {
	var random   = parseInt(Math.random() * 5 + 1);
	var response = new Array(random).join().split(",").map(function (item,index) {
		return createUser();
	})
	return res.json(response);
});


app.listen(3000);