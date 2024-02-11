import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { prisma } from "..";
import ResHelper, { HttpErrorStatus, HttpSuccessStatus } from "../helper/ResponseHelper";

export class TestController {
    static async signUp(request: Request, response: Response, next: NextFunction) {
        const {name, email, posts} = request.body
        const res = new ResHelper()

        try {
            const postData = posts?.map((post: Prisma.PostCreateInput) => {
                return {title: post?.title, content: post?.content}
            })
            const result = await prisma.user.create({
                data: {
                    name,
                    email,
                    posts: {
                        create: postData,
                    }
                }
            })
            res.setData(result)
            res.sendSuccessRes(response, HttpSuccessStatus.Created)
        } catch (err) {            
            res.sendErrorRes(response, err as Error)
        }
    }

    static async post(request: Request, response: Response, next: NextFunction) {
        const {title, content, authorEmail} = request.body
        const res = new ResHelper()
        try {
            const result = await prisma.post.create({
                data: {
                    title,
                    content,
                    author: {connect: {email: authorEmail}}
                }
            })
            res.sendSuccessRes(response, HttpSuccessStatus.Created)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }

    static async addViews (request: Request, response: Response, next: NextFunction) {
        const {id} = request.params
        const res = new ResHelper()
        try {
            const post = await prisma.post.update({
                where: {id: Number(id)},
                data: {
                    viewCount: {
                        increment: 1,
                    }
                }
            })
            res.sendSuccessRes(response, HttpSuccessStatus.updated)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }

    static async publishPost (request: Request, response: Response, next: NextFunction) {
        const {id} = request.params
        const res = new ResHelper()
        try {
            const postData = await prisma.post.findUnique({
                where: {id: Number(id)},
                select: {
                    published: true
                }
            })

            const updatedPost = await prisma.post.update({
                where: {id: Number(id) || undefined},
                data: {published: !postData?.published},
            })
            res.sendSuccessRes(response, HttpSuccessStatus.updated)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }

    static async deletePost (request: Request, response: Response, next: NextFunction) {
        const {id} = request.params
        const res = new ResHelper()
        try {
            const post = await prisma.post.delete({
                where: {id: Number(id)},
            })
            res.sendSuccessRes(response, HttpSuccessStatus.Deleted)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }

    static async getAllUsers (request: Request, response: Response, next: NextFunction) {
        const res = new ResHelper()
        try {
            const users = await prisma.user.findMany()
            res.setData(users)
            res.sendSuccessRes(response, HttpSuccessStatus.Deleted)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }

    static async getUserDrafts (request: Request, response: Response, next: NextFunction) {
        const {id} = request.params
        const res = new ResHelper()
        try {
            const drafts = await prisma.user
            .findUnique({
                where: {
                    id: Number(id)
                }
            })
            .posts({
                where: {published: false}
            })
            res.setData(drafts)
            res.sendSuccessRes(response, HttpSuccessStatus.Success)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }

    static async getPostById (request: Request, response: Response, next: NextFunction) {
        const {id}:{id?:string} = request.params
        const res = new ResHelper()
        try {
            const post = await prisma.post.findUnique({
                where: {id: Number(id)},
            })
            if(!post) {
                throw "id is invalid"
            }
            res.setData(post)
            res.sendSuccessRes(response, HttpSuccessStatus.Success)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)
        }
    }

    static async feed (request: Request, response: Response, next: NextFunction) {
        const {searchString, skip, take, orderBy} = request.query
        const res = new ResHelper()

        try {
            const or:Prisma.PostWhereInput = searchString ? {
                OR: [
                    {title: {contains: searchString as string}},
                    {content: {contains: searchString as string}}
                ],
            } : {}
            const posts = await prisma.post.findMany({
                where: {
                    published: true,
                    ...or,                    
                },
                include: {author: true},
                take: Number(take) || undefined,
                skip: Number(skip) || undefined,
                orderBy: {
                    updatedAt: orderBy as Prisma.SortOrder
                }
            })
            
            res.setData(posts)
            res.sendSuccessRes(response, HttpSuccessStatus.Success)
        } catch (err) {
            res.sendErrorRes(response, err, HttpErrorStatus.BadRequest)            
        }
    }
}