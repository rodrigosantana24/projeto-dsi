

export default function getFriendsFilter(friends, searchText) {
    if (!searchText || searchText.trim() === "") {
        return friends;
    }

    const lowerSearch = searchText.toLowerCase();

    const filteredFriends = friends.filter(friend =>
        (friend.name && friend.name.toLowerCase().includes(lowerSearch)) ||
        (friend.email && friend.email.toLowerCase().includes(lowerSearch))
    );


   return filteredFriends;

}
