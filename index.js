const express = require('express');
const projectModel = require('./data/helpers/projectModel');
const actionModel = require('./data/helpers/actionModel');
const app = express();
app.use(express.json());
const port = 5000;

app.route('/projects')
  .get((req, res) => {
    projectModel.get()
      .then(r => {
        console.log(r);
        if(r) res.status(200).json(r);
        else res.status(404).json({ error: 'Could not retrieve projects' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'Could not complete request' });
      });
  })
  .post((req, res) => {
    let project = req.body;
    if(!project.name || !project.description) res.status(400).json({ message: 'You must include both a name and description' });
    else projectModel.insert(project)
      .then(r => {
        console.log(r);
        if(r !== undefined) res.status(201).json({ message: 'Project created successfully', id: r });
        else res.status(400).json({ error: 'The project could not be added' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'The request could not be completed' });
      });
  });

app.route('/projects/:id')
  .put((req, res) => {
    let id = req.params.id;
    let update = req.body;
    if(!update.name || !update.description) res.status(400).json({ message: 'You must provide a name and description' });
    else projectModel.update(id, update)
      .then(r => {
        console.log(r);
        if(r) res.status(200).json({ message: 'Update applied successfully', updatedEntries: r });
        else res.status(400).json({ error: 'Changes could not be saved' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'Request could not be completed' });
      })
  })
  .delete((req, res) => {
    let id = req.params.id;
    projectModel.remove(id)
      .then(r => {
        console.log(r);
        res.status(200).json({ message: 'Entry deleted successfully' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'Request could not be completed' });
      })
  })
  .get((req, res) => {
    let id = req.params.id;
    projectModel.get(id)
      .then(r => {
        console.log(r);
        if(r) res.status(200).json(r);
        else res.status(400).json({ error: 'Could not retrieve project' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'Request could not be completed' });
      });
  });

app.route('/actions')
  .get((req, res) => {
    actionModel.get()
      .then(r => {
        console.log(r);
        if(r) res.status(200).json(r);
        else res.status(400).json({ error: 'Could not retrieve actions' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'Request could not be completed' });
      })
  })
  .post((req, res) => {
    let action = req.body;
    let pid = action.project_id;
    if(!pid || !action.description || !action.notes) res.status(400).json({ message: 'You must provide project_id, description, and notes' });
    else {
      const verifyAndPost = async () => {
        let exists = await projectModel.get(pid);
        console.log('Does it exist: ', exists);
        if(exists) {
          actionModel.insert(action)
            .then(r => {
              console.log(r);
              if(r !== undefined) res.status(201).json(r);
              else res.status(400).json({ error: 'Could not add action' });
            })
            .catch(e => {
              console.error(e.response);
              res.status(500).json({ errorMessage: 'Request could not be completed' });
            });
        }
        else res.status(400).json({ error: 'A project with that project_id does not exist' });
      };
      verifyAndPost();
    }
  });

app.route('/actions/:id')
  .put((req, res) => {
    let id = req.params.id;
    let update = req.body;
    if(!update.project_id || !update.description || !update.notes) res.status(400).json({ message: 'You must include project_id, description, and notes' });
    else actionModel.update(id, update)
      .then(r => {
        console.log(r);
        if(r) res.status(200).json({ actionsUpdated: r });
        else res.status(400).json({ error: 'Could not update action' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'Request could not be completed' });
      });
  })
  .delete((req, res) => {
    let id = req.params.id;
    actionModel.remove(id)
      .then(r => {
        console.log(r);
        res.status(200).json({ message: 'Successfully deleted action' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'Request could not be completed' });
      })
  })
  .get((req, res) => {
    let id = req.params.id;
    actionModel.get(id)
      .then(r => {
        console.log(r);
        if(r) res.status(200).json(r);
        else res.status(400).json({ error: 'Could not retrieve action' });
      })
      .catch(e => {
        console.error(e.response);
        res.status(500).json({ errorMessage: 'Request could not be completed' });
      });
  });

app.listen(port, () => console.log(`Server listening at http://localhost:${port}`));
