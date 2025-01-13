//hospital server
const express = require("express");
const app = express();
app.use(express.json());

const users = [
  {
    name: "Rabi",
    kidneys: [{ healthy: false }],
  },
];

app.get("/", (req, res) => {
  const noOfKidneys = users[0].kidneys.length;
  let noOfHealthyKidneys = 0;
  for (let i = 0; i < noOfKidneys; i++) {
    if (users[0].kidneys[i].healthy) {
      noOfHealthyKidneys += 1;
    }
  }
  const noOfUnhealthyKidneys = noOfKidneys - noOfHealthyKidneys;
  res.json({ noOfKidneys, noOfHealthyKidneys, noOfUnhealthyKidneys });
});

app.post("/", (req, res) => {
  const isHealthy = req.body.isHealthy;
  users[0].kidneys.push({ healthy: isHealthy });
  res.json({ post: "done" });
});

app.put("/", (req, res) => {
  if (minOneUnhealthy()) {
    for (let i = 0; i < users[0].kidneys.length; i++) {
      if (!users[0].kidneys[i].healthy) {
        users[0].kidneys[i].healthy = true;
      }
    }

    res.json({ put: "done" });
  } else {
    res.status(411).json({ put: "no kidney is unhealthy" });
  }
});

//edge case for putting
//What should happen if they try to make a kidney healthy when all are already healthy
function minOneUnhealthy() {
  for (let i = 0; i < users[0].kidneys.length; i++) {
    if (!users[0].kidneys[i].healthy) {
      return true;
    }
  }
  return false;
}

app.delete("/", (req, res) => {
  if (isThereAtleastOneUnhealthyKidney()) {
    const newKidney = [];
    for (let i = 0; i < users[0].kidneys.length; i++) {
      if (users[0].kidneys[i].healthy) {
        newKidney.push({ healthy: true });
      }
    }
    users[0].kidneys = newKidney;
    res.json({ delete: "done" });
  } else {
    res.status(411).json({ delete: "You have no unhealthy kidneys" });
  }
});

//edge case for deleting
// What should happen if they try to delete when there are no kidneys?
function isThereAtleastOneUnhealthyKidney() {
  let atleastOneUnhealthyKidney = false;
  for (let i = 0; i < users[0].kidneys.length; i++) {
    if (!users[0].kidneys[i].healthy) {
      atleastOneUnhealthyKidney = true;
    }
  }
  return atleastOneUnhealthyKidney;
}

app.listen(3000);
