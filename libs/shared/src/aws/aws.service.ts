import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class AwsService {
  private s3: AWS.S3;
  private sns: AWS.SNS;
  private ses: AWS.SES;

  constructor(private configService: ConfigService) {
    AWS.config.update({
      accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get('AWS_REGION') || 'us-east-1',
    });

    this.s3 = new AWS.S3();
    this.sns = new AWS.SNS();
    this.ses = new AWS.SES();
  }

  async uploadFile(
    bucketName: string,
    key: string,
    body: Buffer | Uint8Array | string,
    contentType?: string,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const params: AWS.S3.PutObjectRequest = {
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    };

    return this.s3.upload(params).promise();
  }

  async deleteFile(bucketName: string, key: string): Promise<AWS.S3.DeleteObjectOutput> {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: bucketName,
      Key: key,
    };

    return this.s3.deleteObject(params).promise();
  }

  async getSignedUrl(bucketName: string, key: string, expires: number = 3600): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: key,
      Expires: expires,
    };

    return this.s3.getSignedUrl('getObject', params);
  }

  async publishToSNS(topicArn: string, message: string, subject?: string): Promise<AWS.SNS.PublishResponse> {
    const params: AWS.SNS.PublishInput = {
      TopicArn: topicArn,
      Message: message,
      Subject: subject,
    };

    return this.sns.publish(params).promise();
  }

  async sendEmail(
    to: string[],
    subject: string,
    htmlBody: string,
    textBody?: string,
    from?: string,
  ): Promise<AWS.SES.SendEmailResponse> {
    const params: AWS.SES.SendEmailRequest = {
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: htmlBody,
          },
          Text: textBody ? {
            Charset: 'UTF-8',
            Data: textBody,
          } : undefined,
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: from || this.configService.get('AWS_SES_FROM_EMAIL'),
    };

    return this.ses.sendEmail(params).promise();
  }
}