



# Documentation RESTful API BLST <img src="http://www.blst.co.id/images/logo-company.png">



##### Index-List-for-Select-Form | GET

```
/api/admin/regionals
/api/select/mbtis
/api/select/fim-references
/api/select/best-performances
/api/select/positions
/api/institution-list
```

- Header : Content-Type (application/json), Accept (application/json), Authorization (Bearer <token>)

### Authorization

------



#### Sign Up

```
/api/signup | POST
```

- Header : Content-Type (application/json), Accept (application/json)
- Body :

```
{
	"name":"full name"
	"email":"e-mail",
	"password":"password"
}
```

- Return :

```
{  
    "message": 'Successfully Create an Account';  
}
```
