const axios = require('axios');

const instance = axios.create({
  baseURL: 'https://<northwestern>.instructure.com/api/v1/',
  timeout: 1000,
  headers: {'Authorization': 'Bearer <1876~PNOXyQnAdOWMrsfnHRIEhAsqgMuVuufFW4SnRTfqLSqiWfXQA04pTFw94uqot1Ss>'}
});

instance.get(`users/${userId}/courses`)
  .then(response => {
    // handle success
    console.log(response);
  })
  .catch(error => {
    // handle error
    console.log(error);
  });

courses.forEach(course => {
  instance.get(`courses/${course.id}/assignments`)
    .then(response => {
      // handle success
      console.log(response);
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
});