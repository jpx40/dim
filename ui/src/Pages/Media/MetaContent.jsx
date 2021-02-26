import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { fetchMediaInfo } from "../../actions/card.js";

import "./MetaContent.scss";

function MetaContent(props) {
  const { id } = useParams();

  const { auth, fetchMediaInfo } = props;
  const { token } = auth;

  useEffect(() => {
    fetchMediaInfo(token, id);
  }, [fetchMediaInfo, id, token]);

  useEffect(() => {
    const { fetched, error, info } = props.media_info;

    // FETCH_MEDIA_INFO_OK
    if (fetched && !error) {
      document.title = `Dim - ${info.name}`;
    }
  }, [props.media_info]);

  let metaContent = <></>;

  // FETCH_MEDIA_INFO_OK
  if (props.media_info.fetched && !props.media_info.error) {
    const {
      description,
      genres,
      name,
      duration,
      rating,
      year,
      media_type,
      id,
      seasons
    } = props.media_info.info;

    const length = {
      hh: ("0" + Math.floor(duration / 3600)).slice(-2),
      mm: ("0" + Math.floor((duration % 3600) / 60)).slice(-2),
      ss: ("0" + Math.floor((duration % 3600) % 60)).slice(-2)
    };

    metaContent = (
      <div className="metaContent">
        <h1>{name}</h1>
        <div className="genres">
          <Link to={`/search?year=${year}`}>{year}</Link>
          <FontAwesomeIcon icon="circle"/>
          {genres &&
            genres.map((genre, i) => <Link to={`/search?genre=${genre}`} key={i}>{genre}</Link>)
          }
        </div>
        <p className="description">{description}</p>
        <div className="meta-info">
          <div className="info">
            <h4>ID</h4>
            <p>{id}</p>
          </div>
          <div className="info">
            <h4>Type</h4>
            <p>{media_type}</p>
          </div>
          {!seasons && (
            <div className="info">
              <h4>Duration</h4>
              <p>{length.hh}:{length.mm}:{length.ss}</p>
            </div>
          )}
          {seasons && (
            <div className="info">
              <h4>Seasons</h4>
              <p>{seasons}</p>
            </div>
          )}
          <div className="info">
            <h4>Rating</h4>
            <p>{rating}/10</p>
          </div>
        </div>
        <div>
          <Link to={`/play/${id}`} className="playBtn">
            <p>Play media</p>
            <FontAwesomeIcon icon="play"/>
          </Link>
        </div>
      </div>
    );
  }

  return metaContent;
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  media_info: state.card.media_info
});

const mapActionsToProps = {
  fetchMediaInfo
};

export default connect(mapStateToProps, mapActionsToProps)(MetaContent);
