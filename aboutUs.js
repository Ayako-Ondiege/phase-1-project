document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(this);

    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    if (!name || !email || !message) {
        document.getElementById('response').innerHTML = '<p>Please fill in all fields.</p>';
        return;
    }

    // Example: Send form data to server or display a success message
    document.getElementById('response').innerHTML = '<p>Message sent successfully!</p>';

    // Optionally, clear the form fields after submission
    this.reset();
});