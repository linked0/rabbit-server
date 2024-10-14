import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../../model/user';
import { authenticationService } from '../../../common'
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return next(new Error('Wrong email or password'));

    const isEqual = await authenticationService.pwdCompare(user.password, password);
    if(!isEqual) return next(new Error('Wrong email or password'));

    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_KEY!);
    req.session = { jwt: token };

    res.status(200).send(user);
});

export { router as SigninRouter };