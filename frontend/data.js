function getUserData(inputs) {
    let data = {}
    for (let input of inputs) {
        if (input.type === 'radio') {
            if (input.checked) {
                data[input.name] = input.value;
            }
        } else {
            data[input.name] = input.value;
        }
    }
    return data;
}