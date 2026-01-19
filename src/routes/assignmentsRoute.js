import express from 'express';
import { 
    getAssignmentsByUserId, 
    createAssignment, 
    deleteAssignment, 
    updateAssignment, 
    toggleAssignmentCompletion, 
    getAssignmentsBySubject 
} from '../controllers/assignmentsController.js';

const router = express.Router();

router.post('/', createAssignment);

router.delete('/:id', deleteAssignment);

router.put('/:id', updateAssignment);

router.patch('/:id/toggle', toggleAssignmentCompletion);

router.get('/:userId', getAssignmentsByUserId);

router.get('/:userId/subject/:subject', getAssignmentsBySubject);

export default router;
