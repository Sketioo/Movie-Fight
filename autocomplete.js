const createAutocomplete = ({root, renderOption, onOptionSelect, inputValue, fetchData}) => {
  root.innerHTML = `
  <label class="label"><b>Search for movie</b></label>
  <input type="text" class="input">
  <div class="dropdown">
    <div class="dropdown-menu">
      <div class="dropdown-content results">

      </div>
    </div>
  </div>
`;

  const input = root.querySelector("input");

  const dropdown = root.querySelector(".dropdown");
  const resultWrapper = root.querySelector(".results");

  const onInput = async (event) => {
    const items = await fetchData(event.target.value);
    dropdown.classList.add("is-active");
    resultWrapper.innerHTML = "";

    if (items.length === 0) {
      dropdown.classList.remove("is-active");
      return;
    }

    for (let item of items) {
      const option = document.createElement("a");
      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);

      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputValue(item);
        onOptionSelect(item);
      });

      resultWrapper.append(option);
    }
  };

  input.addEventListener("input", debounce(onInput));

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
