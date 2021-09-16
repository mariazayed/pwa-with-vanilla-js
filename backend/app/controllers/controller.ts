//   /lib/controllers/controller.ts
import * as mongoose from 'mongoose';
import { ContactSchema } from '../models/model';
import { Request, Response } from 'express';

const contact = mongoose.model('Contact', ContactSchema);
export class ContactController {

    public addNewContact(req: Request, res: Response) {
        let newContact = new contact(req.body);

        newContact.save((err, contact) => {
            if (err) {
                res.send(err);
            }
            res.json(contact);
        });
    }

    public getContacts (req: Request, res: Response) {
        contact.find({}, (err, contact) => {
            if(err){
                res.send(err);
            }
            res.json(contact);
        });
    }

    public getContactWithID (req: Request, res: Response) {
        contact.findById(req.params.contactId, (err, contact) => {
            if(err){
                res.send(err);
            }
            res.json(contact);
        });
    }

    public updateContact (req: Request, res: Response) {
        contact.findOneAndUpdate({ _id: req.params.contactId }, req.body, { new: true }, (err, contact) => {
            if(err){
                res.send(err);
            }
            res.json(contact);
        });
    }

    public deleteContact (req: Request, res: Response) {
        contact.remove({ _id: req.params.contactId }, (err) => {
            if(err){
                res.send(err);
            }
            res.json({ message: 'Successfully deleted contact!'});
        });
    }
}
