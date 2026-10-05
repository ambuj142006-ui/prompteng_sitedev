(function () {
  var KEY = "ambujsri-build-list";
  var LABEL = { idea: "Idea", progress: "In progress", done: "Done" };
  var NEXT = { idea: "progress", progress: "done", done: "idea" };
  var items = [];

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) items = parsed.filter(function (i) { return i && typeof i.title === "string" && LABEL[i.status]; });
    } catch (e) { items = []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* storage unavailable; keep in memory */ }
  }

  var out = document.getElementById("out");

  function render() {
    out.textContent = "";
    if (!items.length) {
      var empty = document.createElement("div");
      empty.className = "empty";
      var s = document.createElement("strong");
      s.textContent = "Your build list is empty";
      var p = document.createElement("span");
      p.textContent = "Add your first goal above, such as a material to test or a topic to learn this week.";
      empty.appendChild(s); empty.appendChild(p);
      out.appendChild(empty);
      return;
    }
    var ul = document.createElement("ul");
    ul.className = "grid";
    items.forEach(function (it) {
      var li = document.createElement("li");
      li.className = "card";
      var h = document.createElement("h3");
      h.textContent = it.title;
      var row = document.createElement("div");
      row.className = "row";
      var b = document.createElement("button");
      b.type = "button"; b.className = "badge"; b.setAttribute("data-s", it.status);
      b.textContent = LABEL[it.status];
      b.setAttribute("aria-label", "Status: " + LABEL[it.status] + ". Change status for " + it.title);
      b.addEventListener("click", function () { it.status = NEXT[it.status]; save(); render(); });
      var d = document.createElement("button");
      d.type = "button"; d.className = "del"; d.textContent = "Delete";
      d.setAttribute("aria-label", "Delete " + it.title);
      d.addEventListener("click", function () { items = items.filter(function (x) { return x !== it; }); save(); render(); });
      row.appendChild(b); row.appendChild(d);
      li.appendChild(h); li.appendChild(row);
      ul.appendChild(li);
    });
    out.appendChild(ul);
  }

  document.getElementById("add-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var t = document.getElementById("title");
    var title = t.value.trim();
    if (!title) return;
    items.unshift({ title: title, status: document.getElementById("status").value });
    t.value = "";
    save(); render(); t.focus();
  });

  load(); render();
})();
