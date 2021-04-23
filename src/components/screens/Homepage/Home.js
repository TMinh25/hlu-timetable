import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
// import components
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import MainFeaturedPost from './HeroImage';
import FeaturedPost from './FeaturedUser';
import { Typography } from '@material-ui/core';
import uhl from './uhl.jpg';
import NTM from './NTM.jpg';
import LAT from './LAT.jpg';

// import styles
import './Home.css';

const mainFeaturedPost = {
  title: 'ĐẠI HỌC HẠ LONG',
  description: 'Học đi đôi với hành | Học để làm người | Học để thành công',
  image: uhl,
  link: 'http://uhl.edu.vn/',
};

const featuredPosts = [
  {
    title: 'Nguyễn Trường Minh',
    date: 'Thành viên nhóm',
    description: 'Người đưa phần mềm từ suy nghĩ thành hiện thực.',
    image: NTM,
    link: 'https://www.facebook.com/sipp.minhh/',
  },
  {
    title: 'Lê Anh Tú',
    date: 'Giảng viên hướng dẫn',
    description: 'Người vun góp ý tưởng.',
    image: LAT,
    link: 'https://www.facebook.com/anhtucntt',
  },
  {
    title: 'Phạm Nguyên Hồng',
    date: 'Thành viên nhóm',
    description: 'Hậu phương phía sau.',
    // image: LAT,
    link: 'https://www.facebook.com/profile.php?id=100032895618007',
  },
];

const Home = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="">
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <h1 id="title" align="center">
            Thành Viên Nhóm
          </h1>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p className="date">29-4-2020</p>
          </div>
          <Grid container spacing={4}>
            {featuredPosts.map(post => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
        </main>
        <h1
          style={{
            margin: 20,
            color: '#c9d0d4',
            fontFamily: 'Helvetica Neue, sans-serif',
            fontSize: '46px',
          }}
          align="center"
        >
          Xin Cảm Ơn!
        </h1>
      </Container>
    </>
  );
};

export default Home;
