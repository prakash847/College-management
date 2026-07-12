const { jsPDF } = window.jspdf;

const semesterData = {
    1: [
        { name: "Mathematics-I", credits: 4 },
        { name: "Engineering Physics", credits: 3 },
        { name: "Engineering Chemistry", credits: 3 },
        { name: "Professional English - I", credits: 3 },
        { name: "Heritage of Tamils", credits: 1 },
        { name: "Python Programming", credits: 3 },
        { name: "Problem Solving Laboratory", credits: 2 },
        { name: "Physics and Chemistry Laboratory", credits: 2 },
        { name: "English Laboratory", credits: 1 }
    ],

    2: [
        { name: "Statistics and Numerical Method", credits: 4 },
        { name: "Physics for Information Science", credits: 3 },
        { name: "Engineering Graphics", credits: 4 },
        { name: "Programming in C", credits: 3 },
        { name: "Professional English - II", credits: 2 },
        { name: "Tamils and Technology", credits: 1 },
        { name: "Basic Electrical and Electronics Engineering", credits: 3 },
        { name: "Engineering Practices Laboratory", credits: 2 },
        { name: "Programming in C Laboratory", credits: 2 },
        { name: "Communication Laboratory", credits: 2 }
    ],

    3: [
        { name: "Discrete Mathematics", credits: 4 },
        { name: "Digital Principles and Computer Organization", credits: 4 },
        { name: "Data Structures", credits: 3 },
        { name: "Object Oriented Programming", credits: 3 },
        { name: "Foundations of Data Science", credits: 3 },
        { name: "Data Structures Laboratory", credits: 1.5 },
        { name: "OOP Laboratory", credits: 1.5 },
        { name: "Data Science Laboratory", credits: 2 },
        { name: "Professional Development", credits: 1 }
    ],

    4: [
        { name: "Theory of Computation", credits: 3 },
        { name: "Artificial Intelligence and Machine Learning", credits: 4 },
        { name: "Algorithms", credits: 4 },
        { name: "Database Management Systems", credits: 3 },
        { name: "Introduction to Operating Systems", credits: 3 },
        { name: "Environmental Science", credits: 2 },
        { name: "Operating Systems", credits: 3 },
        { name: "OS Laboratory", credits: 1.5 },
        { name: "DBMS Laboratory", credits: 1.5 }
    ],

    5: [
        { name: "Computer Networks", credits: 4 },
        { name: "Compiler Design", credits: 4 },
        { name: "Cryptography and Cyber Security", credits: 3 },
        { name: "Distributed Computing", credits: 3 },
        { name: "Professional Elective I", credits: 3 },
        { name: "Professional Elective II", credits: 3 }
    ],

    6: [
        { name: "Object Oriented Software Engineering", credits: 4 },
        { name: "Embedded Systems and IoT", credits: 4 },
        { name: "Professional Elective III", credits: 3 },
        { name: "Professional Elective IV", credits: 3 },
        { name: "Internship", credits: 2 }
    ],

    7: [
        { name: "Software Testing and Quality Assurance", credits: 4 },
        { name: "Cloud Computing", credits: 4 },
        { name: "Project Work/internship", credits: 2 }
    ],

    8: [
        { name: "Project Work/internship", credits: 10 }
    ]
};

const gradePoints = {
    "O": 10,
    "A+": 9,
    "A": 8,
    "B+": 7,
    "B": 6,
    "C": 5,
    "U": 0
};

function updateSemesterOptions() {
    const e = document.getElementById("numSemesters").value;
    const t = document.getElementById("semester");

    t.innerHTML = "";

    for (let n = 1; n <= e; n++) {
        const e = document.createElement("option");
        e.value = n;
        e.textContent = `Semester ${n}`;
        t.appendChild(e);
    }
}

function loadSubjects() {
    const e = Array.from(
        document.getElementById("semester").selectedOptions
    ).map(e => e.value);

    const t = document.getElementById("subjectTable");
    t.innerHTML = "";

    e.forEach(n => {
        const e = document.createElement("h3");
        e.textContent = `Subjects for Semester ${n}`;
        t.appendChild(e);

        const l = document.createElement("table");
        const o = document.createElement("tr");

        o.innerHTML =
            "<th>Subject</th><th>Credits</th><th>Grade</th>";

        l.appendChild(o);

        semesterData[n].forEach(e => {
            const t = document.createElement("tr");

            t.innerHTML = `
                <td>${e.name}</td>
                <td>${e.credits}</td>
                <td>
                    <select>
                        <option value="">Select Grade</option>
                        <option value="O">O</option>
                        <option value="A+">A+</option>
                        <option value="A">A</option>
                        <option value="B+">B+</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="U">U</option>
                    </select>
                </td>
            `;

            l.appendChild(t);
        });

        t.appendChild(l);
    });
}

function showModal() {
    document.getElementById("gradeModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("gradeModal").style.display = "none";
}

function calculateCGPA() {
    const semesters = Array.from(
        document.getElementById("semester").selectedOptions
    ).map(option => option.value);

    const selects = document.querySelectorAll("#subjectTable select");

    let totalCredits = 0;
    let totalPoints = 0;
    let allSelected = true;
    let arrearPapers = [];
    let hasArrear = false;
    let selectIndex = 0;

    semesters.forEach(semester => {
        semesterData[semester].forEach(subject => {
            const grade = selects[selectIndex].value;
            selectIndex++;

            if (grade) {
                totalCredits += subject.credits;
                totalPoints += gradePoints[grade] * subject.credits;

                if (grade === "U") {
                    hasArrear = true;
                    arrearPapers.push(subject.name);
                }
            } else {
                allSelected = false;
            }
        });
    });

    if (!allSelected) {
        showModal();
        return;
    }

    const cgpa = (totalPoints / totalCredits).toFixed(2);

    document.getElementById("result").innerHTML =
        `Your GPA is: ${cgpa}`;

    if (hasArrear) {
        document.getElementById("arrearPapers").innerHTML =
            `<h2 style="color: red;">Arrear Papers:</h2><p>${arrearPapers.join(", ")}</p>`;

        document.getElementById("studyTips").innerHTML =
            "<h2>Study Suggestions:</h2>...";
    } else {
        document.getElementById("arrearPapers").innerHTML = "";
        document.getElementById("studyTips").innerHTML =
            '<h2 style="color: white;">Congrats! No arrears!</h2>';
    }
}

function downloadPDF() {
    const e = new jsPDF();
    const t = document.getElementById("result").innerText;
    const n =
        document.getElementById("arrearPapers").innerText ||
        "No Arrear Papers";

    e.setFontSize(16);
    e.text("CGPA Results", 20, 20);

    e.setFontSize(12);
    e.text(t, 20, 30);
    e.text(`Arrears: ${n}`, 20, 40);

    e.save("CGPA_Result.pdf");
}

function submitFeedback() {
    const e = document.getElementById("feedbackText").value;

    if (e) {
        alert("Feedback submitted: " + e);
        document.getElementById("feedbackText").value = "";
    } else {
        alert("Please enter feedback.");
    }
}

window.addEventListener("load", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userType = urlParams.get("userType");
    const roll = urlParams.get("roll");
    const backButton = document.getElementById("backLink");

    if (userType === "staff") {
        backButton.href = "interface.html?user=staff";
    } else {
        const studentRoll = roll || "910423104030"; // Default roll if not present
        backButton.href = `interface.html?roll=${studentRoll}`;
    }
});