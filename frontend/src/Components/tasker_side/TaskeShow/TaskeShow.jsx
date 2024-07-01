import React, { useEffect } from "react";

const TaskeShow = () => {
  useEffect(() => {
    const fetchData = async () => {
      if (accessToken) {
        try {
          const taskerProfileResponse = await dispatch(
            fetchTaskerProfile(accessToken)
          );

          const userProfileResponse = await dispatch(
            fetchUserProfile(accessToken)
          );

          setTaskerData(taskerProfileResponse.payload);
          setUserData(userProfileResponse.payload.profile);
        } catch (error) {
          console.error("Error fetching profiles:", error);
          setError("Failed to fetch profiles. Please try again.");
        }
      }
    };
    console.log("====================================");
    console.log(fetchData);
    console.log("====================================");
  }, []);

  return <div>this is TaskeShow</div>;
};

export default TaskeShow;
