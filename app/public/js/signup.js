function setRef(value) {
  // 1. update url
  const url = new URL(window.location);
  url.searchParams.set('ref', value);
  window.history.replaceState({}, '', url);

  // 2. update hidden input
  const input = document.querySelector('input[name="ref"]');
  if (input) {
    input.value = value;
  }

  // 3. highlight button
  document.querySelectorAll('.ref-buttons button').forEach(btn => {
    btn.classList.remove('active');
  });

  event.target.classList.add('active');
}

// sync when load page URL → input
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');

  if (ref) {
    const input = document.querySelector('input[name="ref"]');
    if (input) input.value = ref;
  }
});