import { UserInterface } from "@/Interfaces/userInterface";

const extractUserNames = (
  conversationUsers: UserInterface[],
  currLoggedUser: UserInterface | null
) => {
  const getDisplayedUserNames = (
    friends: UserInterface[],
    maxNames: number
  ) => {
    const namesToShow = friends?.slice(0, maxNames)?.map((friend) => {
      if (friend.userName === currLoggedUser?.userName) return "You";
      return friend.userName;
    });
    const remainingCount = friends?.length - maxNames;
    return remainingCount > 0
      ? [...namesToShow, `+${remainingCount}`]
      : namesToShow;
  };

  // Limit of usernames to show based on width (adjust as needed)
  let userNames = "";
  // if (conversationUsers && conversationUsers.length)
  userNames =
    conversationUsers?.length === 2
      ? conversationUsers[0]?.userName === currLoggedUser?.userName
        ? conversationUsers[1]?.userName
        : conversationUsers[0]?.userName
      : getDisplayedUserNames(conversationUsers, 3)?.join(" , ");

  return userNames;
};

const timeAgo = (isoDateString: string) => {
  const now = new Date().getTime(); // Get current time in milliseconds
  const past = new Date(isoDateString).getTime(); // Convert ISO date string to milliseconds

  const diffInMs = now - past; // Difference in milliseconds
  const diffInSeconds = Math.floor(diffInMs / 1000); // Convert to seconds
  const diffInMinutes = Math.floor(diffInSeconds / 60); // Convert to minutes
  const diffInHours = Math.floor(diffInMinutes / 60); // Convert to hours
  const diffInDays = Math.floor(diffInHours / 24); // Convert to days

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hr`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
  }
};

const formatTheDate = (dateString: string) => {
  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0"); // Get day
  const month = date.toLocaleString("default", { month: "long" }); // Get short month name
  const year = String(date.getFullYear()).slice(-4); // Get last two digits of year

  const hours = String(date.getHours()).padStart(2, "0"); // Get hours
  const minutes = String(date.getMinutes()).padStart(2, "0"); // Get minutes

  return `${day} ${month} ${year} ${hours}:${minutes}`;
};

export { timeAgo, extractUserNames, formatTheDate };
