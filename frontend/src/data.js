const data = [
    {"City College of New York" : {
        "food_insecurity": {
          "North Academy Building": { "lat": 40.819713235007384, "lng": -73.95014023322595 },
          "info": {
            "link": "https://www.ccny.cuny.edu/bennysfoodpantry/about-bennys-food-pantry", 
            "text":"The food pantry is located in the NAC building on the 3rd floor. It is open to all students and staff."}
        },
        "mental_health": {
          "Marshak Building": { "lat": 40.819441356346, "lng": -73.94940740874056 },
          "info": {
            "link":"https://www.ccny.cuny.edu/counseling", 
            "text":"Counseling provides students with a safe, confidential, and nonjudgmental space to voice their concerns and address these concerns with a counselor."}
        },
        "health": {
          "Marshak Building": { "lat": 40.819441356346, "lng": -73.94940740874056 },
          "info": {
            "link":"https://www.ccny.cuny.edu/shs", 
            "text":"Student Health Services (SHS) is committed to providing quality care and empowering students to make informed decisions about their health."}
        },
        "financial": {
          "North Academy Center": { "lat": 40.819713235007384, "lng": -73.95014023322595 },
          "info": {
            "link":"https://www.ccny.cuny.edu/financialaid", 
            "text":"The City College Financial Aid Office administers federal and state funds, as well as those provided by special programs, the City University of New York and the College itself, to ensure that you have an opportunity to pursue higher education at CCNY."}
        },
        "housing": {
            "Palladia, Inc": { "lat": 40.80777514274654, "lng": -73.94311192593351 },
            "info": {
              "link":"https://www.homelessshelterdirectory.org/shelter/palladia-inc-126th-st-shelter", 
              "text":"Palladia, Inc. is a non-profit organization that provides housing services to individuals and families in need."}
        }
      }
    },
    {"Queens College" : {
        "food_insecurity": {
          "Student Union Building": { "lat": 40.73429123924807, "lng": -73.81630323749806 },
          "info": {
            "link":"https://www.qc.cuny.edu/sdl/food-pantry/", 
            "text":"The food pantry is located in the Student Union Building, Lower-Level, Room 29. It is open to all CUNY students."}
        },
        "mental_health": {
          "Frese Hall": { "lat": 40.735673863429554, "lng": -73.8172896863978 },
          "info":{
            "link":"https://www.qc.cuny.edu/cs/", 
            "text":"1st floor (Enter through the back door closest to Klapper and Kiely Hall)"}
        },
        "health": {
          "Frese Hall": { "lat": 40.735673863429554, "lng": -73.8172896863978 },
          "info": {
            "link":"https://www.qc.cuny.edu/health/", 
            "text":"Office: 3rd Floor Frese Hall"}
        },
        "financial": {
          "Dining Hall": { "lat": 40.73702175201344, "lng": -73.81746018254628 },
          "info": {
            "link":"https://www.qc.cuny.edu/faid/", 
            "text":"The Financial Aid Office is located in the Dining Hall, Room 128."}
        },
        "housing" : {
            "Palladia, Inc": { "lat": 40.76974509326589, "lng": -73.87577695931759 },
            "info":{
                "link":"https://www.homelessshelterdirectory.org/shelter/ny_the-landing-family-shelter", 
                "text":"Palladia, Inc. is a non-profit organization that provides housing services to individuals and families in need."}
            }
        }
    },
    {"Hunter College" : {
        "food_insecurity": {
          "West Building": { "lat":40.76783926353942, "lng":-73.96452977357418 },
          "info": {
            "link":"https://hunter.cuny.edu/students/health-wellness/emergency-support-resources/", 
            "text":"Hunter College offers a food pantry for all currently enrolled students in need with valid student ID. The pantry is located in the Lower Level of West Building, Room B103."}
        },
        "mental_health": {
          "North Building": { "lat":40.76783926353942, "lng":-73.96452977357418 },
          "info":{
            "link":"https://hunter-graduate.catalog.cuny.edu/student-life/student-services", 
            "text":" The Counseling and Wellness Services at Hunter College offers a range of services to help students cope with the stresses of college life."}
        },
        "health": {
          "North Building": { "lat":40.76783926353942, "lng":-73.96452977357418 },
          "info": {
            "link":"https://hunter.cuny.edu/students/health-wellness/immunization-records/contact-us/", 
            "text":"Hunter manages student immunization compliance with New York State laws and provide assistance with health insurance enrollment through Navigators and Certified Application Counselors, along with referrals to community-based resources."}
        },
        "financial": {
          "North Building": { "lat":40.76783926353942, "lng":-73.96452977357418 },
          "info": {
            "link":"https://hunter.cuny.edu/students/financial-aid/", 
            "text":" The Office of Financial Aid is dedicated to helping students and their families finance a Hunter education."}
        },
        "housing" : {
            "Breaking Ground": { "lat":40.76783926353942, "lng":-73.96452977357418 },
            "info":{
                "link":"https://www.homelessshelterdirectory.org/shelter/ny_breaking-ground", 
                "text":"Breaking Ground provides a variety of homelessness solutions and work with each person to determine what is best for them."}
            }
        }
    },
    { "Baruch College" : {
      "food_insecurity": {
        "Newman Vertical Campus": { "lat":40.740257231977125, "lng":-73.9839671989181 },
        "info": {
          "link":"https://studentaffairs.baruch.cuny.edu/dean-of-students/food/", 
          "text":"Students who face food insecurity are able to make use of the Bearcat Food Pantry. The Pantry is in the BOSS (ground floor of the NVC, room 1-116)."}
      },
      "mental_health": {
        "Baruch College Counseling Center": { "lat":40.74085302767843, "lng":-73.98313936575796 },
        "info":{
          "link":"https://studentaffairs.baruch.cuny.edu/health/topics/mentalhealth/", 
          "text":"The Baruch College Counseling Center provides mental health services to students. It is located in 137 East 25th Street, 9th floor."}
      },
      "health": {
        "Health Center": { "lat":40.74107014501998, "lng":-73.98298332889506 },
        "info": {
          "link":"https://studentaffairs.baruch.cuny.edu/health/ ", 
          "text":"The Baruch College Student Health Care Center provides students with a full range of clinical health services, including initial diagnosis and treatment for a broad spectrum of illnesses and injuries."}
      },
      "financial": {
        "Baruch Financial Aid": { "lat":40.740257231977125, "lng":-73.9839671989181},
        "info": {
          "link":"https://enrollmentmanagement.baruch.cuny.edu/financial-aid-services/ ", 
          "text":"Welcome to Baruch College’s Financial Aid Services! Our website is available for you to learn more about the different types of aid we transact."}
      },
      "housing" : {
        "Palladia, Inc": { "lat":40.74524776135757, "lng":-73.98144274952598 },
        "info":{
            "link":"https://www.homelessshelterdirectory.org/shelter/ny_mainchance-drop-in-center", 
            "text":"Palladia, Inc. is a non-profit organization that provides housing services to individuals and families in need."}
        }
     }
    }
  
]

export default data;