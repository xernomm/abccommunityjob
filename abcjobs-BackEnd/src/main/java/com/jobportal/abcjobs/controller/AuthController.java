package com.jobportal.abcjobs.controller;

import com.jobportal.abcjobs.model.User;
import com.jobportal.abcjobs.repository.UserRepository;
import com.jobportal.abcjobs.request.UserLoginRequestBody;
import com.jobportal.abcjobs.response.CustomErrorResponse;
import com.jobportal.abcjobs.response.SuccessLoginResponse;
import com.jobportal.abcjobs.service.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    ResponseEntity<Object> loginEmailAndPassword(@RequestBody UserLoginRequestBody user) {

        Optional<User> findByEmail = userRepository.findByEmail(user.getEmail());

        if (!findByEmail.isPresent()) {
            CustomErrorResponse error = new CustomErrorResponse("Email not found.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } else {
            User userFromDb = findByEmail.get();

            if(userFromDb.isSuspended()){
                CustomErrorResponse error = new CustomErrorResponse("User suspended.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            // Use the passwordEncoder to match the provided password with the stored hashed password
            if (!passwordEncoder.matches(user.getPassword(), userFromDb.getPassword())) {
                CustomErrorResponse error = new CustomErrorResponse("Invalid password.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            String generatedToken = jwtUtil.generateToken(userFromDb.getEmail());
            SuccessLoginResponse tokenResponse = new SuccessLoginResponse(generatedToken, userFromDb.getUserName(),
                    userFromDb.getEmail(),
                    userFromDb.getRoleId(),
                    userFromDb.isSuspended(),
                    userFromDb.getUserDetails(),
                    userFromDb.getThreads());

            return ResponseEntity.ok(tokenResponse);
        }
    }



    @GetMapping("/needAuth")
    public String needAuth() {
        return "Hello P";
    }

    @GetMapping("/createToken")
    public String createToken() {
        return jwtUtil.generateToken("jwt@token.com");
    }

    @GetMapping("/getToken")
    public ResponseEntity<Object> whoAmI(@RequestParam("token") String token) {

        if (jwtUtil.validateToken(token)) {
            String email = jwtUtil.getUsernameFromToken(token);

            Optional<User> findByEmail = userRepository.findByEmail(email);
            if (findByEmail.isPresent()) {
                return ResponseEntity.ok(findByEmail.get());
            } else {
                CustomErrorResponse error = new CustomErrorResponse("Email not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } else {
            CustomErrorResponse error = new CustomErrorResponse("Token is not valid");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }
}
