## S5: Role Base Access Control for Shop
**Extention Client HTTP to send request like postman**

### About Controller
 Controller (not router) take request from client:
 ```
 signUp = async (req, res, next) => {...}
 ```
then call the service and return response:
```
return res.status(201).json(
    await AccessService.signup(req.body)
);
```

### About service signup
- Use .lean() to just find a properties
- When find out "email" already exists => return error first

### JWT + RSA + ASYMETRIC ENCRYPTION
1. Create pair key: Public and Private (crypto package)
2. Should have a table to store public key (string RSA) and refreshtoken
3. Create token pair

