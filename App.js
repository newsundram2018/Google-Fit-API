import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import GoogleFit, {Scopes} from 'react-native-google-fit';

const App = () => {
  var [dailySteps, setdailySteps] = useState(0);
  var today = new Date();
  var lastWeekDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 8,
  );
  const opt = {
    startDate: lastWeekDate.toISOString(), // required ISO8601Timestamp
    endDate: today.toISOString(), // required ISO8601Timestamp
    bucketUnit: 'DAY', // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
    bucketInterval: 1, // optional - default 1.
  };
  useEffect(() => {
    console.log('useEffect running');
    const options = {
      scopes: [
        Scopes.FITNESS_ACTIVITY_READ,
        // Scopes.FITNESS_ACTIVITY_WRITE,
        // Scopes.FITNESS_BODY_READ,
        // Scopes.FITNESS_BODY_WRITE,
        // Scopes.FITNESS_BLOOD_PRESSURE_READ,
        // Scopes.FITNESS_BLOOD_PRESSURE_WRITE,
        // Scopes.FITNESS_BLOOD_GLUCOSE_READ,
        // Scopes.FITNESS_BLOOD_GLUCOSE_WRITE,
        // Scopes.FITNESS_NUTRITION_WRITE,
        // Scopes.FITNESS_SLEEP_READ,
      ],
    };
    GoogleFit.checkIsAuthorized().then(() => {
      var authorized = GoogleFit.isAuthorized;
      console.log(authorized);
      if (authorized) {
        // if already authorized, fetch data
      } else {
        // Authentication if already not authorized for a particular device
        GoogleFit.authorize(options)
          .then(authResult => {
            if (authResult.success) {
              console.log('AUTH_SUCCESS');
              fetchStepsData(opt);
              // if successfully authorized, fetch data
            } else {
              console.log('AUTH_DENIED ' + authResult.message);
            }
          })
          .catch(() => {
            console.log('AUTH_ERROR');
          });
      }
    });
  }, []);

  let fetchStepsData = async opt => {
    const res = await GoogleFit.getDailyStepCountSamples(opt);
    if (res.length !== 0) {
      for (var i = 0; i < res.length; i++) {
        if (res[i].source === 'com.google.android.gms:estimated_steps') {
          let data = res[i].steps.reverse();
          dailyStepCount = res[i].steps;
          setdailySteps(data[0].value);
        }
      }
    } else {
      console.log('Not Found');
    }
  };

  useEffect(() => {
    console.log(dailySteps, 'dailySteps');
  }, [dailySteps]);

  return (
    <View style={styles.container}>
      <Text>App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

export default App;
