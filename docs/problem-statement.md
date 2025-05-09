# 📝 Problem Statement
Include:

* What is the main functionality?
* Who are the intended users?
* How will you integrate GenAI meaningfully?
* Describe some scenarios how your app will function?

Our application helps TUM students organize and prioritize the courses on their study plan through smart recommendations based on their interests. The application
will have a chat in which the user can describe topics of interest and course recommendations will be provided. GenAI will be used to analyze the course offerings in TUMOnline and based on the course description and registration possibilities offer an explanation of why the course might be of interest. Also previous coursework and study program are taken into account when creating the recommendation.


**Use Scenarios**:
1. Bob is interested in software engineering and has heard about GOF software design patterns but isn't sure which course could handle such interesting topics. So he decides to use 
ClosedAI's TUMCourseFinder, He first logs in with his TUMOnline account and writes a prompt in the chat asking for relevant course that match his interests. Then the chat replies with the course Patterns in Software Engineering, a short description and explanation why it matches Bob's interests and a link to the course in TUMOnline to register.

2. Alice is searching for courses to visit in the upcoming semester but doesn't know what courses to choose. After logging in to TUMCourseFinder, she writes a a prompt in the chat stating that she needs recommendations of courses to take during the semester, so the system checks Alice's previous courseworks and sees that she took Computer Vision 1 in the past, so the system replies in the chat with the course Computer Vision 2 and an explanation on the topics it expands on from the previous lecture.

