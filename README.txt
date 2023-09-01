Hi, thank you for downloading my sample job community portal,
before running this project, here are things you MUST do.

1. Go to application properties

a. Go trough abcjobs-BackEnd\src\main\resources and find application.properties.
b. edit the application.properties 

##Database -- connect mysql
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://localhost:3306/(DATABASE NAME)?useSSL=false&allowPublicKeyRetrieval=true
spring.datasource.username=(YOUR DATABASE USERNAME)
spring.datasource.password=(YOUR DATABASE PASSWORD)

c. To run the backend, click run application after you make sure the DATABASE IS MADE 
d. To run the front-end, go trough command prompt and navigate to abcjobsfrontend 

	cd abcjobsfrontend
	npm start

There are 2 roles in this website, to become ADMIN, go to user table in your database,
and CHANGE ROLE ID FIELD TO "1"

feel free to add as many users and post threads as possible.

Enjoy!
