const axios = require('axios');

const testToken = '[none]'
const instance = axios.create({
  baseURL: 'https://canvas.instructure.com/api/v1/'
});

//  get all courses
instance.get(`courses?access_token=${testToken}`)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });


// get assignments for each course
courses.forEach(course => {
  instance.get(`courses/:${course.id}/assignments`)
    .then(response => {
      // handle success
      console.log(response);
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});

// get to do items for each course
// GET|/api/v1/courses/:course_id/todo
courses.forEach(course => {
  instance.get(`courses/:${course.id}/todo`)
    .then(response => {
      // handle success
      console.log(response);
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});


// GET /api/v1/courses/:course_id/quizzes
courses.forEach(course => {
  instance.get(`courses/:${course.id}/quizzes`)
    .then(response => {
      // handle success
      console.log(response);
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});

// calendar_events

//  get all events on calendar 
instance.get(`calender_events?access_token=${testToken}`)
  .then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  });

