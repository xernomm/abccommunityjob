package com.jobportal.abcjobs.controller;

import com.jobportal.abcjobs.model.*;
import com.jobportal.abcjobs.repository.*;
import com.jobportal.abcjobs.request.*;
import com.jobportal.abcjobs.response.ResponseData;
import com.jobportal.abcjobs.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    public UserService userService;

    @Autowired
    public UserRepository userRepository;

    @Autowired
    public ThreadsRepository threadsRepository;

    @Autowired
    public ThreadsService threadsService;

    @Autowired
    public ThreadCommentsRepository threadCommentsRepository;

    @Autowired
    public ThreadCommentsService threadCommentsService;

    @Autowired
    public ThreadCommentReplyRepository threadCommentReplyRepository;

    @Autowired
    public  ThreadCommentReplyService threadCommentReplyService;

    @Autowired
    public PostJobService postJobService;

    @Autowired
    public JobRepository jobRepository;

    @Autowired
    public AppliedUserService appliedUserService;

    @Autowired
    public AppliedUserRepository appliedUserRepository;

    @Autowired
    public ContactMessageRepository contactMessageRepository;

    @Autowired
    public ContactMessageService contactMessageService;

    @Autowired
    private final PasswordEncoder passwordEncoder;




    @Autowired
    public UserDetailsService userDetailsService;

    public UserController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<ResponseData<RegisterRequestBody>> saveUser(@RequestBody RegisterRequestBody registerRequestBody) {
        ResponseData<RegisterRequestBody> responseData = new ResponseData<>();
        User user = new User();
        UserDetails userDetails = new UserDetails();

//        BASIC
        user.setRoleId(2);
        user.setSuspended(false);
        user.setUserName(registerRequestBody.getUserName());
        user.setEmail(registerRequestBody.getEmail());
        user.setPassword(registerRequestBody.getPassword());

//        DETAILS
        userDetails.setAddress(registerRequestBody.getAddress());
        userDetails.setAge(registerRequestBody.getAge());
        userDetails.setEducation(registerRequestBody.getEducation());
        userDetails.setUniversity(registerRequestBody.getUniversity());
        userDetails.setPhoneNumber(registerRequestBody.getPhoneNumber());
        userDetails.setExperience(registerRequestBody.getExperience());

        user.setUserDetails(userDetails);

//        SAVE
        userService.saveUser(user);

        responseData.setStatus(true);
        responseData.setMessage("User Successfully Registered");
        responseData.setPayLoad(registerRequestBody);
        return ResponseEntity.ok(responseData);

    }

    @PutMapping("/suspendUser/{userId}")
    public ResponseEntity<String> suspendAccount(@PathVariable Long userId){
        Optional<User> idUser = userRepository.findById(userId);

        if(idUser.isEmpty()){
            throw new IllegalArgumentException("user not found");
        }
        User suspendedUser = idUser.get();
        suspendedUser.setSuspended(true);

        userService.editUser(suspendedUser);

        return ResponseEntity.ok("User " + suspendedUser.getEmail() + " is suspended now.");
    }

    @PutMapping("/unSuspendUser/{userId}")
    public ResponseEntity<String> unSuspendAccount(@PathVariable Long userId){
        Optional<User> idUser = userRepository.findById(userId);

        if(idUser.isEmpty()){
            throw new IllegalArgumentException("user not found");
        }
        User suspendedUser = idUser.get();
        suspendedUser.setSuspended(false);

        userService.editUser(suspendedUser);

        return ResponseEntity.ok("User " + suspendedUser.getEmail() + " is not suspended now.");
    }



    @PostMapping("/edit-profile")
    public ResponseEntity<ResponseData<EditProfileRequestBody>> editProfile(@RequestParam(name = "email") String email, EditProfileRequestBody editProfileRequestBody){
        ResponseData<EditProfileRequestBody> responseData = new ResponseData<>();
        Optional<User> emailUser = userRepository.findByEmail(email);
        if(emailUser.isEmpty()){
            responseData.setMessage("Not Found");
            responseData.setStatus(false);
            throw new IllegalArgumentException("error");
        }

        User currentUser = emailUser.get();


        currentUser.setUserName(editProfileRequestBody.getUserName());
        currentUser.getUserDetails().setAge(editProfileRequestBody.getAge());
        currentUser.getUserDetails().setAddress(editProfileRequestBody.getAddress());
        currentUser.getUserDetails().setPhoneNumber(editProfileRequestBody.getPhoneNumber());
        currentUser.getUserDetails().setEducation(editProfileRequestBody.getEducation());
        currentUser.getUserDetails().setUniversity(editProfileRequestBody.getUniversity());
        currentUser.getUserDetails().setExperience(editProfileRequestBody.getExperience());
        currentUser.getUserDetails().setBio(editProfileRequestBody.getBio());

        if(currentUser.getUserDetails().getAge() < 18){
            currentUser.setSuspended(true);
        }

        try {
            userService.saveWithProfile(currentUser, editProfileRequestBody.getProfilePicture());
        } catch (IOException e){
            responseData.setMessage("Error uploading thread with image.");
            responseData.setStatus(false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseData);
        }

        userRepository.save(currentUser);
        responseData.setStatus(true);
        responseData.setMessage("User Successfully Updated");

        return ResponseEntity.ok(responseData);
    }

    @PostMapping("/change-password")
    public ResponseEntity<ResponseData<ChangePasswordRequestBody>> changePassword(@RequestBody ChangePasswordRequestBody changePasswordRequestBody) {
        ResponseData<ChangePasswordRequestBody> responseData = new ResponseData<>();

        Optional<User> findByEmail = userRepository.findByEmail(changePasswordRequestBody.getEmail());

        if (findByEmail.isEmpty()) {
            throw new IllegalArgumentException("Email not found!");
        }

        User userFromDb = findByEmail.get();
        if(userFromDb.getPassword() == changePasswordRequestBody.getNewPassword()){
            throw new IllegalArgumentException("Password cannot be same");
        }

        userFromDb.setPassword(changePasswordRequestBody.getNewPassword());
        userService.updateUser(userFromDb);

        responseData.setStatus(true);
        responseData.setMessage("Password Successfully Changed");
        responseData.setPayLoad(changePasswordRequestBody);
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/all-user")
    public List<User> allUser(){
        return userService.getAllUsers();
    }


    @PostMapping("/post-thread")
    public ResponseEntity<ResponseData<PostThreadRequestBody>> postThread(PostThreadRequestBody postThreadRequestBody, @RequestParam(name = "email") String email){
        ResponseData<PostThreadRequestBody> responseData = new ResponseData<>();

        Optional<User> emailUser = userRepository.findByEmail(email);
        if(emailUser.isEmpty()){
            responseData.setMessage("Not Found");
            responseData.setStatus(false);
            throw new IllegalArgumentException("error");
        }

        User user = emailUser.get();

        ThreadEntity threadEntity = new ThreadEntity();
        threadEntity.setThreadHeader(postThreadRequestBody.getThreadHeader());
        threadEntity.setThreadBody(postThreadRequestBody.getThreadBody());
        threadEntity.setHashtags(postThreadRequestBody.getHashtags());
        threadEntity.setThreadDate(LocalDateTime.now());
        threadEntity.setUser(user);

        try {
            threadsService.saveThreadWithImage(threadEntity, postThreadRequestBody.getThreadImage());
        } catch (IOException e) {
            // Handle image processing error
            responseData.setMessage("Error uploading thread with image.");
            responseData.setStatus(false);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(responseData);
        }

        threadsRepository.save(threadEntity);
        responseData.setStatus(true);
        responseData.setMessage("Thread uploaded");
        return ResponseEntity.ok(responseData);
    }



    @PostMapping("/editThread")
    public ResponseEntity<String> editThreads(EditThreadRequestBody editThreadRequestBody, @RequestParam(name = "threadId") Long threadId) throws IOException {
        Optional<ThreadEntity> idThread = threadsRepository.findById(threadId);
        if(idThread.isEmpty()){
            throw new IllegalArgumentException("thread not found");
        }

        ThreadEntity currentThread = idThread.get();

        currentThread.setThreadHeader(editThreadRequestBody.getThreadHeader());
        currentThread.setThreadBody(editThreadRequestBody.getThreadBody());
        currentThread.setHashtags(editThreadRequestBody.getHashtags());
        currentThread.setThreadDate(LocalDateTime.now());

        threadsRepository.save(currentThread);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/all-threads")
    public List<ThreadEntity> allThreads(){
        return threadsService.getAllThreads();
    }

    @PutMapping("{email}/comment/{threadId}")
    public ResponseEntity<ResponseData<ThreadCommentsRequestBody>> postThreadComment(@RequestBody ThreadCommentsRequestBody threadCommentsRequestBody, @PathVariable Long threadId, @PathVariable String email){
        ResponseData<ThreadCommentsRequestBody> responseData = new ResponseData<>();
        Optional<User> emailUser = userRepository.findByEmail(email);
        User commentingUser = emailUser.get();
        Optional<ThreadEntity> idThread = threadsRepository.findById(threadId);
        ThreadEntity commentedThread = idThread.get();

        ThreadComments threadComments = new ThreadComments();
        threadComments.setComment(threadCommentsRequestBody.getThreadComment());
        threadComments.setUser(commentingUser);
        threadComments.setCommentDate(LocalDateTime.now());

        commentedThread.getThreadComments().add(threadComments);
        threadComments.setThreadEntity(commentedThread);
        threadsService.saveThread(commentedThread);


        responseData.setStatus(true);
        responseData.setMessage("Comment uploaded");
        responseData.setPayLoad(threadCommentsRequestBody);
        return ResponseEntity.ok(responseData);
    }


    @PutMapping("{email}/reply/{commentId}")
    public ResponseEntity<ResponseData<ThreadCommentReplyRequestBody>> replyComment(@RequestBody ThreadCommentReplyRequestBody threadCommentReplyRequestBody, @PathVariable Long commentId, @PathVariable String email){
        ResponseData<ThreadCommentReplyRequestBody> responseData = new ResponseData<>();
        Optional<User> emailUser = userRepository.findByEmail(email);
        User replyingUser = emailUser.get();
        Optional<ThreadComments> idComment = threadCommentsRepository.findById(commentId);
        ThreadComments replyComment = idComment.get();

        CommentReply commentReply = new CommentReply();
        commentReply.setCommentReply(threadCommentReplyRequestBody.getCommentReply());
        commentReply.setUser(replyingUser);
        commentReply.setReplyDate(LocalDateTime.now());

        commentReply.setThreadComments(replyComment);
        replyComment.getCommentReply().add(commentReply);
        threadCommentsService.saveComment(replyComment);

        responseData.setStatus(true);
        responseData.setMessage("Reply uploaded");
        responseData.setPayLoad(threadCommentReplyRequestBody);
        return ResponseEntity.ok(responseData);
    }

    @GetMapping("/all-comments")
    public List<ThreadComments> allComments(){
        return threadCommentsService.allComments();
    }

    @GetMapping("/all-comment-reply")
    public List<CommentReply> allCommentReply(){
        return threadCommentReplyService.allReply();
    }

    @GetMapping("/comments/{threadId}")
    public List<ThreadComments> commentsOnOneThread(@PathVariable Long threadId){
        Optional<ThreadEntity> idThread = threadsRepository.findById(threadId);

        if (idThread.isPresent()) {
            ThreadEntity theThread = idThread.get();
            return theThread.getThreadComments();
        } else {
            return Collections.emptyList();
        }
    }

    @GetMapping("/comments/{threadId}/{commentId}/replies")
    public List<CommentReply> repliesForOneComment(@PathVariable Long threadId, @PathVariable Long commentId) {
        Optional<ThreadEntity> idThread = threadsRepository.findById(threadId);

        if (idThread.isPresent()) {
            ThreadEntity theThread = idThread.get();
            List<ThreadComments> threadCommentsList = theThread.getThreadComments();

            for (ThreadComments threadComments : threadCommentsList) {
                if (threadComments.getCommentId().equals(commentId)) {
                    return threadComments.getCommentReply();
                }
            }
        }

        return Collections.emptyList();
    }

    @GetMapping("/comments/{threadId}/count")
    public ResponseEntity<Integer> getCommentCountForThread(@PathVariable Long threadId) {
        int commentCount = threadCommentsService.getCommentCountForThread(threadId);
        return ResponseEntity.ok(commentCount);
    }

    @GetMapping("/replies/{commentId}/count")
    public ResponseEntity<Integer> getReplyCountForComment(@PathVariable Long commentId) {
        int replyCount = threadCommentReplyService.getReplyCountForComment(commentId);
        return ResponseEntity.ok(replyCount);
    }
    @GetMapping("/thread/{threadId}")
    public ResponseEntity<Map<String, Object>> getThreadWithCommentsAndReplies(@PathVariable Long threadId) {
        Optional<ThreadEntity> threadOptional = threadsRepository.findById(threadId);

        if (threadOptional.isPresent()) {
            ThreadEntity thread = threadOptional.get();
            List<ThreadComments> comments = thread.getThreadComments();
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("thread", thread);
            responseData.put("comments", comments);
            return ResponseEntity.ok(responseData);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/post-job")
    public ResponseEntity<ResponseData<PostJobRequestBody>> postJob(@RequestBody PostJobRequestBody postJobRequestBody, @RequestParam(name = "email") String email){
        ResponseData<PostJobRequestBody> responseData = new ResponseData<>();
        Optional<User> idUser = userRepository.findByEmail(email);
        User postingUser = idUser.get();

        Jobs jobs = new Jobs();
        jobs.setJobName(postJobRequestBody.getJobName());
        jobs.setJobDescription(postJobRequestBody.getJobDescription());
        jobs.setCompany(postJobRequestBody.getCompany());
        jobs.setCompanyContact(postJobRequestBody.getCompanyContact());
        jobs.setCompanyMail(postJobRequestBody.getCompanyMail());
        jobs.setJobUploader(postingUser.getUserName());
        jobs.setQuota(postJobRequestBody.getQuota());
        jobs.setSalary(postJobRequestBody.getSalary());

        postJobService.saveJob(jobs);
        responseData.setStatus(true);
        responseData.setMessage("Job uploaded");
        responseData.setPayLoad(postJobRequestBody);
        return ResponseEntity.ok(responseData);
    }

    @PutMapping("/{email}/applying/{jobId}")
    public ResponseEntity<String> applyJob(@PathVariable String email, @PathVariable Long jobId) {
        Optional<User> idUser = userRepository.findByEmail(email);
        Optional<Jobs> jobs = jobRepository.findById(jobId);


        if (idUser.isPresent() && jobs.isPresent()) {
            User applyingUser = idUser.get();
            Jobs appliedJob = jobs.get();

            // Check if the user has already applied to this job
            boolean alreadyApplied = appliedJob.getApplicants().stream()
                    .anyMatch(user -> user.getUserId().equals(applyingUser.getUserId()));

            if (alreadyApplied) {
                throw new IllegalArgumentException("User with email " + email + " has already applied to this job.");
            }

            // Check if the user has already applied to this job using the AppliedUser table
            boolean alreadyAppliedUsingAppliedUser = appliedUserRepository.existsByUserAndJobs(applyingUser, appliedJob);

            if (alreadyAppliedUsingAppliedUser) {
                throw new IllegalArgumentException("User with email " + email + " has already applied to this job.");
            }

            AppliedUser appliedUser = new AppliedUser();
            appliedUser.setUser(applyingUser);
            appliedUser.setJobs(appliedJob);
            appliedUser.setAccepted(false);

            appliedUserService.saveNewApplicant(appliedUser);

            return ResponseEntity.ok("Job applied successfully");
        }

        return ResponseEntity.badRequest().body("User or job not found");
    }

    @PutMapping("/resign/{applicantId}/{email}/{jobId}")
    public ResponseEntity<String> resignWorkers(@PathVariable Long applicantId, @PathVariable String email, @PathVariable Long jobId){
        Optional<AppliedUser> idApplicant = appliedUserRepository.findById(applicantId);
        AppliedUser acceptedApplicant = idApplicant.get();

        Optional<User> idUser = userRepository.findByEmail(email);
        User applyingUser = idUser.get();

        Optional<Jobs> jobs = jobRepository.findById(jobId);
        Jobs appliedJobs = jobs.get();

        if (acceptedApplicant.getUser().equals(applyingUser)) {
            if(!acceptedApplicant.isAccepted()){
                throw new IllegalArgumentException("User already resigned!");
            }
            acceptedApplicant.setAccepted(false);
            applyingUser.getJobsApplied().remove(appliedJobs);
            appliedJobs.getApplicants().remove(applyingUser);
            appliedJobs.updateIsFull();
        } else {
            return ResponseEntity.badRequest().body("The provided applicant is not associated with the applying user.");
        }
        userRepository.save(applyingUser);
        jobRepository.save(appliedJobs);

        return ResponseEntity.ok("Applicant resigned successfully");
    }

    @PutMapping("/accept/{applicantId}/{email}/{jobId}")
    public ResponseEntity<String> acceptApplicants(@PathVariable Long applicantId, @PathVariable String email, @PathVariable Long jobId) {
        Optional<AppliedUser> idApplicant = appliedUserRepository.findById(applicantId);
        AppliedUser acceptedApplicant = idApplicant.get();

        Optional<User> idUser = userRepository.findByEmail(email);
        User applyingUser = idUser.get();

        Optional<Jobs> jobs = jobRepository.findById(jobId);
        Jobs appliedJobs = jobs.get();

        if (appliedJobs.isFull()){
            throw new IllegalArgumentException("Job quota full!");
        }

        if (acceptedApplicant.getUser().equals(applyingUser)) {
            if(acceptedApplicant.isAccepted()){
                throw new IllegalArgumentException("User already accepted!");
            }
            acceptedApplicant.setAccepted(true);
            applyingUser.getJobsApplied().add(appliedJobs);
            appliedJobs.getApplicants().add(applyingUser);
            appliedJobs.updateIsFull();
        } else {
            return ResponseEntity.badRequest().body("The provided applicant is not associated with the applying user.");
        }

        userRepository.save(applyingUser);
        jobRepository.save(appliedJobs);

        return ResponseEntity.ok("Applicant accepted successfully");
    }

    @GetMapping("/all-applicants/admin")
    public List<AppliedUser> getAllApplicants() {
        List<AppliedUser> allApplicants = appliedUserService.getAllApplicants();

        // Filter out the applicants with isAccepted = true
        List<AppliedUser> pendingApplicants = allApplicants.stream()
                .filter(applicant -> !applicant.isAccepted())
                .collect(Collectors.toList());

        return pendingApplicants;
    }

    @GetMapping("/all-workers/admin")
    public List<AppliedUser> getAllWorkers() {
        List<AppliedUser> allApplicants = appliedUserService.getAllApplicants();

        // Filter out the applicants with isAccepted = true
        List<AppliedUser> pendingApplicants = allApplicants.stream()
                .filter(applicant -> applicant.isAccepted())
                .collect(Collectors.toList());

        return pendingApplicants;
    }


    @GetMapping("/applicantDetails/{applicantId}")
    public ResponseEntity<AppliedUser> getApplicantDetails(@PathVariable Long applicantId){
            Optional<AppliedUser> idApplicant = appliedUserRepository.findById(applicantId);
            if(idApplicant.isPresent()){
                return ResponseEntity.ok(idApplicant.get());
            }
            return ResponseEntity.notFound().build();
    }

    @GetMapping("/find/{userId}")
    public ResponseEntity<User> getUserById(@PathVariable Long userId) {
        Optional<User> idUser = userRepository.findById(userId);
        if (idUser.isPresent()) {
            return ResponseEntity.ok(idUser.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/get-details-user/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> idUser = userRepository.findByEmail(email);
        if (idUser.isPresent()) {
            return ResponseEntity.ok(idUser.get());
        }
        return ResponseEntity.notFound().build();
    }



    @GetMapping("/job/{jobId}")
    public ResponseEntity<Jobs> getJobDetails(@PathVariable Long jobId) {
        Optional<Jobs> job = jobRepository.findById(jobId);
        if (job.isPresent()) {
            return ResponseEntity.ok(job.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/all-jobs")
    public List<Jobs> allJobs(){
        return postJobService.allJobs();
    }


    @DeleteMapping("/deleteUser/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        userService.deleteUserById(userId);
        return ResponseEntity.ok("User deleted successfully");
    }

    @DeleteMapping("/deleteThread/{threadId}")
    public ResponseEntity<String> deleteThread(@PathVariable Long threadId) {
        threadsService.deleteThread(threadId);
        return ResponseEntity.ok("Thread deleted successfully");
    }

    @DeleteMapping("/deleteJob/{jobId}")
    public void deleteJobs(@PathVariable Long jobId) {
        postJobService.deleteJobs(jobId);
    }



    @DeleteMapping("/deleteComment/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        threadCommentsService.deleteComment(commentId);
        return ResponseEntity.ok("Comment deleted successfully");
    }

    @DeleteMapping("/rejectApplicant/{applicantId}")
    public ResponseEntity<String> rejectApplicant(@PathVariable Long applicantId) {
        appliedUserService.deleteApplicant(applicantId);
        return ResponseEntity.ok("Applicant rejected");
    }



    @GetMapping("/all-comments/admin")
    public Map<String, Object> allCommentsAdmin() {
        List<ThreadComments> comments = threadCommentsService.allComments();
        long commentsCount = comments.size();

        Map<String, Object> result = new HashMap<>();
        result.put("comments", comments);
        result.put("commentsCount", commentsCount);

        return result;
    }

    @GetMapping("/all-threads/admin")
    public Map<String, Object> allThreadsAdmin() {
        List<ThreadEntity> threads = threadsService.getAllThreads();
        long threadsCount = threads.size();

        Map<String, Object> result = new HashMap<>();
        result.put("threads", threads);
        result.put("threadsCount", threadsCount);

        return result;
    }

    @GetMapping("/all-user/admin")
    public Map<String, Object> allUserAdmin() {
        List<User> users = userService.getAllUsers();
        long usersCount = users.size();

        Map<String, Object> result = new HashMap<>();
        result.put("users", users);
        result.put("usersCount", usersCount);

        return result;
    }

    @GetMapping("/all-jobs/admin")
    public Map<String, Object> allJobsAdmin() {
        List<Jobs> jobs = postJobService.allJobs();
        long jobsCount = jobs.size();

        Map<String, Object> result = new HashMap<>();
        result.put("jobs", jobs);
        result.put("jobsCount", jobsCount);

        return result;
    }

    @PostMapping("/contactUs/send")
    public ResponseEntity<ResponseData<ContactMessageRequestBody>> contactUs(@RequestBody ContactMessageRequestBody contactMessageRequestBody){
    ResponseData<ContactMessageRequestBody> responseData = new ResponseData<>();

    ContactMessage contactMessage = new ContactMessage();
    contactMessage.setEmail(contactMessageRequestBody.getEmail());
    contactMessage.setMessage(contactMessageRequestBody.getMessage());

    contactMessageService.saveMessage(contactMessage);

    responseData.setPayLoad(contactMessageRequestBody);
    responseData.setStatus(true);
    responseData.setMessage("message sent");
    return ResponseEntity.ok(responseData);
    }


    @DeleteMapping("/deleteMessage/{contactId}")
    public ResponseEntity<String> deleteMessage(@PathVariable Long contactId) {
        contactMessageService.deleteMessage(contactId);
        return ResponseEntity.ok("Message deleted successfully");
    }

    @GetMapping("/allContacts")
    public List<ContactMessage> findAllContacts(){
        return contactMessageService.allMessages();
    }

}
