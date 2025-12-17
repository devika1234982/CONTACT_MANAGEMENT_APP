let page = 1;
let editId = null;

// fetch contacts
async function fetchContacts() {
  const sort = document.getElementById("sort").value;
  const country = document.getElementById("country").value;
  const limit = document.getElementById("limit").value;
  const search = document.getElementById("searchInput").value;

  const res = await fetch(
    `/api/contacts?page=${page}&limit=${limit}&sort=${sort}&countryCode=${country}&search=${search}`
  );

  const data = await res.json();
  renderContacts(data.contacts);

  document.getElementById("page").innerText =
    `${data.currentPage} / ${data.totalPages}`;

}

//render contacts
function renderContacts(contacts) {
  const container = document.getElementById("contacts");
  container.innerHTML = "";

  if (contacts.length === 0) {
    container.innerHTML = "<p>No contacts found</p>";
    return;
  }

  contacts.forEach(contact => {
    container.innerHTML += `
      <div class="card">
        <h4>${contact.name}</h4>
        <p>${contact.countryCode} ${contact.phone}</p>

        <div class="card-actions">
          <button class="btn btn-edit" onclick="editContact('${contact._id}')">
            ✏️ Edit
          </button>
          <button class="btn btn-delete" onclick="deleteContact('${contact._id}')">
            🗑 Delete
          </button>
        </div>
      </div>
    `;
  });
}

//add or edit contacts
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const countryCode = document.getElementById("countryCode").value;

  if (!name || !phone || !countryCode) {
    alert("Please fill all fields");
    return;
  }

  // EDIT MODE
  if (editId) {
    await fetch(`/api/contacts/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, countryCode })
    });

    editId = null;
  }
  // ADD MODE
  else {
    await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, countryCode })
    });
  }

  e.target.reset();
  fetchContacts();
});

//delete contact
async function deleteContact(id) {
  if (!confirm("Are you sure you want to delete this contact?")) return;

  await fetch(`/api/contacts/${id}`, {
    method: "DELETE"
  });

  fetchContacts();
}

//edit contact
async function editContact(id) {
  const res = await fetch(`/api/contacts`);
  const data = await res.json();

  const contact = data.contacts.find(c => c._id === id);

  document.getElementById("name").value = contact.name;
  document.getElementById("phone").value = contact.phone;
  document.getElementById("countryCode").value = contact.countryCode;

  editId = id;
}

// live search as user types
document.getElementById("searchInput").addEventListener("input", () => {
  page = 1;
  fetchContacts();
});

// search when button is clicked
document.getElementById("searchBtn").addEventListener("click", () => {
  page = 1;
  fetchContacts();
});

// when filters change, reset to first page and refetch
document.getElementById("sort").addEventListener("change", () => {
  page = 1;
  fetchContacts();
});

document.getElementById("country").addEventListener("change", () => {
  page = 1;
  fetchContacts();
});

document.getElementById("limit").addEventListener("change", () => {
  page = 1;
  fetchContacts();
});

//pagination
document.getElementById("next").onclick = () => {
  page++;
  fetchContacts();
};

document.getElementById("prev").onclick = () => {
  if (page > 1) {
    page--;
    fetchContacts();
  }
};

fetchContacts();





