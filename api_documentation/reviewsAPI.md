## Available routes

- Get All Reviews: GET http://localhost:8080/api/v1/reviews
<p> (Can use query parameters for city, state, country and username: e.g. "/reviews?country=Mexico" to search review for establishments in Mexico)</p>

- Get Review by Username: GET http://localhost:8080/api/v1/reviews/username
```json
{
	"username": "Manuel-Alejandro"
}
```


- Add Review: POST http://localhost:8080/api/v1/reviews/CRUD

```json
{
"username": "Juan Diaz",
"location": {
	"city": "CDMX",
	"state": "Estado de Mexico",
	"country": "Mexico"
},
"review_values": {
	"quality": 1,
	"communication": 5,
	"price": 3,
	"value": 3,
	"satisfaction": 2,
	"service": 3,
	"cleanliness": 1,
	"comfort": 1,
	"location": 1
},
"review_comment": "Pesimo servicio.",
"review_recommendation": "Mejorar todo"
}
```

- Delete Review: DELETE http://localhost:8080/api/v1/reviews/CRUD
<p> (Can soft delete a review. username and location are needed for identification) </p>

```json
{
"username": "Manuel Alejandro",
"location": {
	"city": "Mexicali",
	"state": "Baja California",
	"country": "Mexico"
}
}
```

<br>

## Dummy JSON values
```json
{
"username": "Manuel Alejandro",
"location": {
	"city": "Mexicali",
	"state": "Baja California",
	"country": "Mexico"
},
"review_values": {
	"quality": 3,
	"communication": 4,
	"price": 5,
	"value": 5,
	"satisfaction": 4,
	"service": 3,
	"cleanliness": 1,
	"comfort": 1,
	"location": 5
},
"review_comment": "Muy buen servicio.",
"review_recommendation": "Podria mejorarse la estancia",
	
	
"username": "Oscar Rosete",
"location": {
	"city": "Tijuana",
	"state": "Baja California",
	"country": "Mexico"
},
"review_values": {
	"quality": 5,
	"communication": 5,
	"price": 5,
	"value": 5,
	"satisfaction": 5,
	"service": 5,
	"cleanliness": 5,
	"comfort": 5,
	"location": 5
},
"review_comment": "Excelente servicio.",
"review_recommendation": "Nada que mejorar en mi opinion",

	
"username": "Juan Diaz",
"location": {
	"city": "CDMX",
	"state": "Estado de Mexico",
	"country": "Mexico"
},
"review_values": {
	"quality": 1,
	"communication": 2,
	"price": 3,
	"value": 3,
	"satisfaction": 2,
	"service": 3,
	"cleanliness": 1,
	"comfort": 1,
	"location": 1
},
"review_comment": "Pesimo servicio.",
"review_recommendation": "Mejorar todo"
}
```
